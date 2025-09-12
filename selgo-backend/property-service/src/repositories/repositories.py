from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_, or_, asc, desc
from geoalchemy2 import Geometry
from geoalchemy2.functions import ST_Distance, ST_Transform, ST_SetSRID, ST_MakePoint
from typing import List, Optional, Dict, Any, Tuple
from ..models.models import PropertyCategory, Property, PropertyImage, PropertyFacility, Facility, PropertyMessage, UserFavorite
from ..models.property_schemas import PropertyFilterParams, GeoPoint
import logging

logger = logging.getLogger(__name__)

class PropertyCategoryRepository:
    @staticmethod
    def create(db: Session, category_data: Dict[str, Any]) -> PropertyCategory:
        db_category = PropertyCategory(**category_data)
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category

    @staticmethod
    def get_by_id(db: Session, category_id: int) -> Optional[PropertyCategory]:
        return db.query(PropertyCategory).filter(PropertyCategory.id == category_id).first()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[PropertyCategory]:
        return db.query(PropertyCategory).offset(skip).limit(limit).all()

    @staticmethod
    def update(db: Session, category_id: int, category_data: Dict[str, Any]) -> Optional[PropertyCategory]:
        db_category = db.query(PropertyCategory).filter(PropertyCategory.id == category_id).first()
        if db_category:
            for key, value in category_data.items():
                setattr(db_category, key, value)
            db.commit()
            db.refresh(db_category)
        return db_category

    @staticmethod
    def delete(db: Session, category_id: int) -> bool:
        db_category = db.query(PropertyCategory).filter(PropertyCategory.id == category_id).first()
        if db_category:
            db.delete(db_category)
            db.commit()
            return True
        return False

class PropertyRepository:
    @staticmethod
    def create(db: Session, property_data: Dict[str, Any]) -> Property:
        if 'location' in property_data and property_data['location'] is not None:
            location = property_data.pop('location')
            lat, lon = location.latitude, location.longitude
            property_data['location'] = f'SRID=4326;POINT({lon} {lat})'

        db_property = Property(**property_data)
        db.add(db_property)
        db.commit()
        db.refresh(db_property)
        return db_property

    @staticmethod
    def get_by_id(db: Session, property_id: str) -> Optional[Property]:
        return db.query(Property).filter(Property.id == property_id).first()

    @staticmethod
    def get_all_with_filters(db: Session, filters: Dict[str, Any]) -> List[Property]:
        query = db.query(Property)

        if filters.get("property_type"):
            query = query.filter(Property.property_type == filters["property_type"])
        if filters.get("min_price"):
            query = query.filter(Property.price >= filters["min_price"])
        if filters.get("max_price"):
            query = query.filter(Property.price <= filters["max_price"])
        if filters.get("min_bedrooms"):
            query = query.filter(Property.bedrooms >= filters["min_bedrooms"])
        if filters.get("max_bedrooms"):
            query = query.filter(Property.bedrooms <= filters["max_bedrooms"])
        if filters.get("min_bathrooms"):
            query = query.filter(Property.bathrooms >= filters["min_bathrooms"])
        if filters.get("max_bathrooms"):
            query = query.filter(Property.bathrooms <= filters["max_bathrooms"])

        return query.all()

    @staticmethod
    def update(db: Session, property_id: str, property_data: Dict[str, Any]) -> Optional[Property]:
        db_property = db.query(Property).filter(Property.id == property_id).first()

        if not db_property:
            return None

        if 'location' in property_data and property_data['location'] is not None:
            location = property_data.pop('location')
            lat, lon = location.latitude, location.longitude
            property_data['location'] = f'SRID=4326;POINT({lon} {lat})'

        for key, value in property_data.items():
            if hasattr(db_property, key):
                setattr(db_property, key, value)

        db.commit()
        db.refresh(db_property)
        return db_property

    @staticmethod
    def delete(db: Session, property_id: str) -> bool:
        db_property = db.query(Property).filter(Property.id == property_id).first()
        if db_property:
            db.delete(db_property)
            db.commit()
            return True
        return False

    @staticmethod
    def increment_view_count(db: Session, property_id: str) -> Optional[Property]:
        db_property = db.query(Property).filter(Property.id == property_id).first()
        if db_property:
            db_property.views_count += 1
            db.commit()
            db.refresh(db_property)
        return db_property
