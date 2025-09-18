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
import json

# Create router
router = APIRouter(
    prefix="/api/v1/chats",
    tags=["chats"],
    responses={404: {"description": "Not found"}}
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, conversation_id: int, websocket: WebSocket):
        await websocket.accept()
        if conversation_id not in self.active_connections:
            self.active_connections[conversation_id] = []
        self.active_connections[conversation_id].append(websocket)

    def disconnect(self, conversation_id: int, websocket: WebSocket):
        if conversation_id in self.active_connections:
            self.active_connections[conversation_id].remove(websocket)

    async def broadcast(self, conversation_id: int, message: str):
        if conversation_id in self.active_connections:
            for connection in self.active_connections[conversation_id]:
                await connection.send_text(message)

manager = ConnectionManager()

@router.websocket("/ws/{conversation_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, conversation_id: int, user_id: int, db: Session = Depends(get_db)):
    await manager.connect(conversation_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)

            # Create message in database
            message_create = MessageCreate(
                conversation_id=conversation_id,
                sender_id=user_id,
                content=message_data['content']
            )
            new_message = ChatService.create_message(db, message_create, user_id)

            if new_message:
                # Broadcast message to all participants in the conversation
                await manager.broadcast(
                    conversation_id,
                    json.dumps(MessageResponse.model_validate(new_message).model_dump())
                )
    except WebSocketDisconnect:
        manager.disconnect(conversation_id, websocket)


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