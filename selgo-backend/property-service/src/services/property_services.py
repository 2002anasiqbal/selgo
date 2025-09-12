from sqlalchemy.orm import Session
from typing import List, Optional, Tuple
from ..repositories.repositories import PropertyCategoryRepository, PropertyRepository
from ..models.models import PropertyCategory, Property
from ..models.property_schemas import PropertyCategoryCreate, PropertyCreate, PropertyUpdate, PropertyFilterParams

class PropertyCategoryService:
    @staticmethod
    def create_category(db: Session, category_data: PropertyCategoryCreate) -> PropertyCategory:
        return PropertyCategoryRepository.create(db, category_data.dict())
    
    @staticmethod
    def get_category_by_id(db: Session, category_id: int) -> Optional[PropertyCategory]:
        return PropertyCategoryRepository.get_by_id(db, category_id)
    
    @staticmethod
    def get_all_categories(db: Session, skip: int = 0, limit: int = 100) -> List[PropertyCategory]:
        return PropertyCategoryRepository.get_all(db, skip, limit)
    
    @staticmethod
    def update_category(db: Session, category_id: int, category_data: PropertyCategoryCreate) -> Optional[PropertyCategory]:
        return PropertyCategoryRepository.update(db, category_id, category_data.dict())
    
    @staticmethod
    def delete_category(db: Session, category_id: int) -> bool:
        return PropertyCategoryRepository.delete(db, category_id)

class PropertyService:
    @staticmethod
    def create_property(db: Session, property_data: PropertyCreate, user_id: str) -> Property:
        property_dict = property_data.dict()
        property_dict['owner_id'] = user_id
        return PropertyRepository.create(db, property_dict)
    
    @staticmethod
    def get_property_by_id(db: Session, property_id: str, increment_view: bool = False) -> Optional[Property]:
        prop = PropertyRepository.get_by_id(db, property_id)
        if prop and increment_view:
            return PropertyRepository.increment_view_count(db, property_id)
        return prop
    
    @staticmethod
    def get_all_properties(db: Session, filters: dict) -> List[Property]:
        return PropertyRepository.get_all_with_filters(db, filters)

    @staticmethod
    def update_property(db: Session, property_id: str, property_data: PropertyUpdate, user_id: str) -> Optional[Property]:
        prop = PropertyRepository.get_by_id(db, property_id)
        if not prop or str(prop.owner_id) != user_id:
            return None
        
        property_dict = property_data.dict(exclude_unset=True)
        return PropertyRepository.update(db, property_id, property_dict)
    
    @staticmethod
    def delete_property(db: Session, property_id: str, user_id: str) -> bool:
        prop = PropertyRepository.get_by_id(db, property_id)
        if not prop or str(prop.owner_id) != user_id:
            return False
        
        return PropertyRepository.delete(db, property_id)