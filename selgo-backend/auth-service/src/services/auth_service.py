from sqlalchemy.orm import Session
from typing import Optional, Tuple
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from ..models.user_models import User, RefreshToken, UserRole, AuthProvider
from ..models.user_schemas import UserCreate, LoginRequest, UserResponse
from ..repositories.user_repository import UserRepository
from ..utils.auth_utils import hash_password, verify_password, create_access_token, create_refresh_token, generate_email_verification_token, generate_otp, generate_password_reset_token
from ..config.config import settings
import logging

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
        
        user = self.user_repo.create(db, user_dict)
        self.send_email_verification(db, user)
        return user

    def send_email_verification(self, db: Session, user: User):
        """Send email verification token."""
        token = generate_email_verification_token()
        expires_at = datetime.utcnow() + timedelta(hours=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS)
        self.user_repo.update_email_verification_token(db, user.id, token, expires_at)
        # In a real application, you would send an email here
        # For example: send_email(user.email, "Verify your email", f"Token: {token}")
        logger.info(f"Generated email verification token for {user.email}: {token}")

    def verify_email(self, db: Session, token: str) -> bool:
        """Verify user's email."""
        user = self.user_repo.get_by_email_verification_token(db, token)
        if not user or user.email_verification_expires < datetime.utcnow():
            return False

        return self.user_repo.verify_email(db, user.id)

    def send_phone_verification(self, db: Session, user: User):
        """Send phone verification code."""
        if not user.phone:
            return

        otp = generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=settings.PHONE_VERIFICATION_OTP_EXPIRE_MINUTES)
        self.user_repo.update_phone_verification_code(db, user.id, otp, expires_at)
        # In a real application, you would send an SMS here
        # For example: send_sms(user.phone, f"Your verification code is: {otp}")
        logger.info(f"Generated phone verification OTP for {user.phone}: {otp}")

    def verify_phone(self, db: Session, user_id: int, otp: str) -> bool:
        """Verify user's phone."""
        user = self.user_repo.get_by_id(db, user_id)
        if not user or user.phone_verification_code != otp or user.phone_verification_expires < datetime.utcnow():
            return False

        return self.user_repo.verify_phone(db, user.id)
    
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

    def request_password_reset(self, db: Session, email: str):
        """Request a password reset."""
        user = self.user_repo.get_by_email(db, email)
        if not user:
            # Don't reveal that the user does not exist
            return

        token = generate_password_reset_token()
        expires_at = datetime.utcnow() + timedelta(hours=settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS)
        self.user_repo.update_password_reset_token(db, user.id, token, expires_at)
        # In a real application, you would send an email here
        # For example: send_email(user.email, "Password Reset", f"Token: {token}")
        logger.info(f"Generated password reset token for {user.email}: {token}")

    def reset_password(self, db: Session, token: str, new_password: str) -> bool:
        """Reset user's password."""
        user = self.user_repo.get_by_password_reset_token(db, token)
        if not user or user.password_reset_expires < datetime.utcnow():
            return False

        new_hashed_password = hash_password(new_password)
        return self.user_repo.update_password(db, user.id, new_hashed_password)
    
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