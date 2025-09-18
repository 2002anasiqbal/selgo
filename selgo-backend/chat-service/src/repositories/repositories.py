from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from ..models.chat_models import Conversation, Message, Participant
from ..models.chat_schemas import ConversationCreate, MessageCreate
from sqlalchemy import and_

class ChatRepository:
    @staticmethod
    def create_conversation(db: Session, conversation_data: ConversationCreate, user_id: int) -> Conversation:
        # Check if a conversation with these participants and item already exists
        participant_ids = sorted(conversation_data.participant_ids + [user_id])

        existing_conversation = db.query(Conversation).filter(
            Conversation.item_id == conversation_data.item_id
        ).filter(
            and_(*[Conversation.participants.any(user_id=pid) for pid in participant_ids])
        ).first()

        if existing_conversation:
            return existing_conversation

        db_conversation = Conversation(item_id=conversation_data.item_id)
        db.add(db_conversation)
        db.commit()
        db.refresh(db_conversation)

        # Add participants
        for participant_id in participant_ids:
            participant = Participant(user_id=participant_id, conversation_id=db_conversation.id)
            db.add(participant)

        db.commit()
        db.refresh(db_conversation)

        return db_conversation

    @staticmethod
    def get_user_conversations(db: Session, user_id: int) -> List[Conversation]:
        return db.query(Conversation).join(Participant).filter(Participant.user_id == user_id).all()

    @staticmethod
    def get_conversation(db: Session, conversation_id: int, user_id: int) -> Optional[Conversation]:
        return db.query(Conversation).join(Participant).filter(
            Conversation.id == conversation_id,
            Participant.user_id == user_id
        ).first()

    @staticmethod
    def create_message(db: Session, message_data: MessageCreate, user_id: int) -> Optional[Message]:
        conversation = ChatRepository.get_conversation(db, message_data.conversation_id, user_id)
        if not conversation:
            return None

        db_message = Message(
            conversation_id=message_data.conversation_id,
            sender_id=message_data.sender_id,
            content=message_data.content
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return db_message

    @staticmethod
    def get_messages(db: Session, conversation_id: int, user_id: int) -> Optional[List[Message]]:
        conversation = ChatRepository.get_conversation(db, conversation_id, user_id)
        if not conversation:
            return None

        return db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.timestamp.asc()).all()