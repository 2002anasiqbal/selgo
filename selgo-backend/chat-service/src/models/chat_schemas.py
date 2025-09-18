from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ==================== Participant Schemas ====================
class ParticipantBase(BaseModel):
    user_id: int

class ParticipantCreate(ParticipantBase):
    pass

class ParticipantResponse(ParticipantBase):
    id: int
    conversation_id: int

    class Config:
        orm_mode = True

# ==================== Conversation Schemas ====================
class ConversationBase(BaseModel):
    item_id: Optional[str] = None

class ConversationCreate(BaseModel):
    participant_ids: List[int]
    item_id: Optional[str] = None

class ConversationResponse(ConversationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    participants: List[ParticipantResponse] = []

    class Config:
        orm_mode = True

# ==================== Message Schemas ====================
class MessageBase(BaseModel):
    content: str

class MessageCreate(MessageBase):
    conversation_id: int
    sender_id: int

class MessageResponse(MessageBase):
    id: int
    conversation_id: int
    sender_id: int
    timestamp: datetime

    class Config:
        orm_mode = True
