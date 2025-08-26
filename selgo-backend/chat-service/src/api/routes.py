from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List

from ..services.services import ChatService
from ..models.chat_schemas import (
    ConversationCreate,
    ConversationResponse,
    MessageCreate,
    MessageResponse,
)
from ..database.database import get_db
from ..utils.auth import get_current_user_id

# Create router
router = APIRouter(
    prefix="/api/v1/chats",
    tags=["chats"],
    responses={404: {"description": "Not found"}}
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages if needed
    except WebSocketDisconnect:
        manager.disconnect(user_id)


# ==================== Conversation Routes ====================

@router.post("/conversations", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_conversation(
    conversation: ConversationCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ChatService.create_conversation(db, conversation, current_user_id)

@router.get("/conversations", response_model=List[ConversationResponse])
async def get_user_conversations(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ChatService.get_user_conversations(db, current_user_id)

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    conversation = ChatService.get_conversation(db, conversation_id, current_user_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation

# ==================== Message Routes ====================

@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def create_message(
    conversation_id: int,
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    new_message = ChatService.create_message(db, conversation_id, message, current_user_id)
    if not new_message:
        raise HTTPException(status_code=404, detail="Conversation not found or user not a participant")

    # Notify the other participant via WebSocket
    conversation = ChatService.get_conversation(db, conversation_id, current_user_id)
    for participant in conversation.participants:
        if participant.user_id != current_user_id:
            await manager.send_personal_message(f"New message from {current_user_id}", participant.user_id)

    return new_message

@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    messages = ChatService.get_messages(db, conversation_id, current_user_id)
    if messages is None:
        raise HTTPException(status_code=404, detail="Conversation not found or user not a participant")
    return messages