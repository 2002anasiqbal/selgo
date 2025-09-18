from sqlalchemy.orm import Session
from typing import Optional, Tuple
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from ..models.user_models import User, RefreshToken, UserRole, AuthProvider
from ..models.user_schemas import UserCreate, LoginRequest, UserResponse
from ..repositories.user_repository import UserRepository
from ..utils.auth_utils import hash_password, verify_password, create_access_token, create_refresh_token
from ..config.config import settings
import logging
import secrets

logger = logging.getLogger(__name__)

class AuthService:
    def __init__(self):
        self.user_repo = UserRepository()
    
    def register_user(self, db: Session, user_data: UserCreate) -> User:
        """Register a new user."""
        # Check if user already exists
        existing_user = self.user_repo.get_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        existing_username = self.user_repo.get_by_username(db, user_data.username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create user
        hashed_password = hash_password(user_data.password)
        user_dict = user_data.dict(exclude={'password'})
        user_dict['hashed_password'] = hashed_password
        user_dict['auth_provider'] = AuthProvider.EMAIL
        
        return self.user_repo.create(db, user_dict)
    
    def authenticate_user(self, db: Session, login_data: LoginRequest) -> Tuple[str, str, User]:
        """Authenticate user and return tokens."""
        # Try to find user by username or email
        user = self.user_repo.get_by_username(db, login_data.username)
        if not user:
            user = self.user_repo.get_by_email(db, login_data.username)
        
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username/email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Create tokens
        access_token = self._create_user_access_token(user)
        refresh_token = self._create_user_refresh_token(db, user)
        
        # Update last login
        self.user_repo.update_last_login(db, user.id)
        
        return access_token, refresh_token, user
    
    def refresh_access_token(self, db: Session, refresh_token: str) -> str:
        """Create new access token from refresh token."""
        token_record = self.user_repo.get_refresh_token(db, refresh_token)
        
        if not token_record or token_record.is_revoked:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        if token_record.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired"
            )
        
        user = self.user_repo.get_by_id(db, token_record.user_id)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        return self._create_user_access_token(user)
    
    def revoke_refresh_token(self, db: Session, refresh_token: str) -> bool:
        """Revoke a refresh token (logout)."""
        return self.user_repo.revoke_refresh_token(db, refresh_token)
    
    def change_password(self, db: Session, user_id: int, current_password: str, new_password: str) -> bool:
        """Change user password."""
        user = self.user_repo.get_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if not verify_password(current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password"
            )
        
        new_hashed_password = hash_password(new_password)
        return self.user_repo.update_password(db, user_id, new_hashed_password)

    def request_password_reset(self, db: Session, email: str) -> bool:
        """Generate a password reset token and send it to the user."""
        user = self.user_repo.get_by_email(db, email)
        if not user:
            logger.warning(f"Password reset request for non-existent user: {email}")
            return False

        # Generate a secure token
        token = secrets.token_urlsafe(32)

        # Set token and expiration
        user.password_reset_token = token
        user.password_reset_expires = datetime.utcnow() + timedelta(hours=1) # 1 hour expiry

        db.commit()

        # Simulate sending an email
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        logger.info(f"Password reset for {email}: {reset_url}")
        # In a real application, you would use a mail service here.
        # For example:
        # from ..utils.email_service import send_password_reset_email
        # send_password_reset_email(user.email, reset_url)

        return True

    def reset_password(self, db: Session, token: str, new_password: str) -> bool:
        """Reset the user's password using a token."""
        user = self.user_repo.get_by_password_reset_token(db, token)

        if not user:
            logger.error(f"Invalid password reset token received: {token}")
            return False

        if user.password_reset_expires < datetime.utcnow():
            logger.error(f"Expired password reset token for user: {user.email}")
            user.password_reset_token = None
            user.password_reset_expires = None
            db.commit()
            return False

        # Reset password and clear token fields
        user.hashed_password = hash_password(new_password)
        user.password_reset_token = None
        user.password_reset_expires = None
        db.commit()

        logger.info(f"Password for user {user.email} has been reset successfully.")
        return True
    
    def _create_user_access_token(self, user: User) -> str:
        """Create access token for user."""
        token_data = {
            "sub": str(user.id),
            "username": user.username,
            "email": user.email,
            "role": user.role.value,
            "is_active": user.is_active
        }
        return create_access_token(token_data)
    
    def _create_user_refresh_token(self, db: Session, user: User) -> str:
        """Create and store refresh token for user."""
        refresh_token = create_refresh_token()
        expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
        self.user_repo.create_refresh_token(db, user.id, refresh_token, expires_at)
        return refresh_token