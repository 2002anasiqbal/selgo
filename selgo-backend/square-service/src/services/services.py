from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any, Tuple
from ..repositories.repositories import (
    ItemCategoryRepository,
    ItemRepository,
    ItemImageRepository,
    ItemRatingRepository,
    UserFavoriteRepository
)
from ..models.item_models import (
    ItemCategory,
    Item,
    ItemImage,
    ItemRating,
    UserFavorite
)
from ..models.item_schemas import (
    ItemCategoryCreate,
    ItemCreate,
    ItemUpdate,
    ItemFilterParams,
    ItemImageCreate,
    ItemRatingCreate
)
import logging

logger = logging.getLogger(__name__)

class ResourceNotFoundException(Exception):
    pass

class ItemCategoryService:
    @staticmethod
    def create_category(db: Session, category_data: ItemCategoryCreate) -> ItemCategory:
        return ItemCategoryRepository.create(db, category_data.dict())

    @staticmethod
    def get_category_by_id(db: Session, category_id: int) -> ItemCategory:
        category = ItemCategoryRepository.get_by_id(db, category_id)
        if not category:
            raise ResourceNotFoundException("Category not found")
        return category

    @staticmethod
    def get_all_categories(db: Session, skip: int = 0, limit: int = 100) -> List[ItemCategory]:
        return ItemCategoryRepository.get_all(db, skip, limit)

    @staticmethod
    def get_categories_with_counts(db: Session) -> List[Tuple[ItemCategory, int]]:
        return ItemCategoryRepository.get_all_with_counts(db)

    @staticmethod
    def get_top_level_categories(db: Session) -> List[ItemCategory]:
        return ItemCategoryRepository.get_by_parent_id(db, None)

    @staticmethod
    def get_subcategories(db: Session, parent_id: int) -> List[ItemCategory]:
        return ItemCategoryRepository.get_by_parent_id(db, parent_id)

    @staticmethod
    def update_category(db: Session, category_id: int, category_data: ItemCategoryCreate) -> ItemCategory:
        category = ItemCategoryRepository.update(db, category_id, category_data.dict())
        if not category:
            raise ResourceNotFoundException("Category not found")
        return category

    @staticmethod
    def delete_category(db: Session, category_id: int):
        if not ItemCategoryRepository.delete(db, category_id):
            raise ResourceNotFoundException("Category not found")

class ItemService:
    @staticmethod
    def create_item(db: Session, item_data: ItemCreate, user_id: int) -> Item:
        images_data = []
        if hasattr(item_data, 'images') and item_data.images:
            images_data = item_data.images

        item_dict = item_data.dict(exclude={'images'})
        item_dict['user_id'] = user_id

        db_item = ItemRepository.create(db, item_dict)

        if images_data:
            ItemImageRepository.create_many(db, db_item.id, [img.dict() for img in images_data])

        return db_item

    @staticmethod
    def get_featured_items(db: Session, limit: int = 10) -> List[Item]:
        from sqlalchemy import desc
        query = db.query(Item).filter(Item.status == "active")

        from datetime import datetime, timedelta
        recent_cutoff = datetime.utcnow() - timedelta(hours=24)

        query = query.order_by(
            desc(Item.created_at >= recent_cutoff),
            desc(Item.created_at)
        )
        return query.limit(limit).all()

    @staticmethod
    def get_homepage_items(db: Session, limit: int = 10) -> List[Item]:
        from sqlalchemy import desc, or_
        query = db.query(Item).filter(Item.status == "active")

        from datetime import datetime, timedelta
        very_recent_cutoff = datetime.utcnow() - timedelta(hours=6)

        query = query.order_by(
            desc(or_(Item.is_featured == True, Item.created_at >= very_recent_cutoff)),
            desc(Item.created_at)
        )
        return query.limit(limit).all()

    @staticmethod
    def get_item_by_id(db: Session, item_id: int, increment_view: bool = False) -> Item:
        item = ItemRepository.get_by_id(db, item_id)
        if not item:
            raise ResourceNotFoundException("Item not found")

        if increment_view:
            item = ItemRepository.increment_view_count(db, item_id)

        return item

    @staticmethod
    def get_all_items(db: Session, skip: int = 0, limit: int = 100) -> List[Item]:
        return ItemRepository.get_all(db, skip, limit)

    @staticmethod
    def filter_items(db: Session, filters: ItemFilterParams) -> Tuple[List[Item], int]:
        return ItemRepository.filter_items(db, filters)

    @staticmethod
    def get_recommended_items(db: Session, limit: int = 10) -> List[Item]:
        return ItemRepository.get_recommended_items(db, limit)

    @staticmethod
    def update_item(db: Session, item_id: int, item_data: ItemUpdate, user_id: int) -> Item:
        item = ItemRepository.get_by_id(db, item_id)
        if not item or item.user_id != user_id:
            raise ResourceNotFoundException("Item not found or permission denied")

        item_dict = item_data.dict(exclude_unset=True)
        updated_item = ItemRepository.update(db, item_id, item_dict)
        if not updated_item:
            raise ResourceNotFoundException("Item not found")
        return updated_item

    @staticmethod
    def delete_item(db: Session, item_id: int, user_id: int):
        item = ItemRepository.get_by_id(db, item_id)
        if not item or item.user_id != user_id:
            raise ResourceNotFoundException("Item not found or permission denied")

        if not ItemRepository.delete(db, item_id):
            raise ResourceNotFoundException("Item not found")

class ItemImageService:
    @staticmethod
    def add_image(db: Session, item_id: int, image_data: ItemImageCreate, user_id: int) -> ItemImage:
        item = ItemRepository.get_by_id(db, item_id)
        if not item or item.user_id != user_id:
            raise ResourceNotFoundException("Item not found or permission denied")

        image = ItemImageRepository.create(db, item_id, image_data.dict())
        if not image:
            raise HTTPException(status_code=500, detail="Failed to create image")
        return image

    @staticmethod
    def get_images(db: Session, item_id: int) -> List[ItemImage]:
        return ItemImageRepository.get_by_item_id(db, item_id)

    @staticmethod
    def delete_image(db: Session, image_id: int, user_id: int):
        image = ItemImageRepository.get_by_id(db, image_id)
        if not image:
            raise ResourceNotFoundException("Image not found")

        item = ItemRepository.get_by_id(db, image.item_id)
        if not item or item.user_id != user_id:
            raise ResourceNotFoundException("Item not found or permission denied")

        if not ItemImageRepository.delete(db, image_id):
            raise ResourceNotFoundException("Image not found")

class ItemRatingService:
    @staticmethod
    def create_rating(db: Session, rating_data: ItemRatingCreate, user_id: int) -> ItemRating:
        item = ItemRepository.get_by_id(db, rating_data.item_id)
        if not item:
            raise ResourceNotFoundException("Item not found")

        existing_ratings = ItemRatingRepository.get_by_item_id(db, rating_data.item_id)
        for rating in existing_ratings:
            if rating.user_id == user_id:
                return ItemRatingRepository.update(db, rating.id, {
                    'stars': rating_data.stars,
                    'review': rating_data.review
                })

        rating_dict = rating_data.dict()
        rating_dict['user_id'] = user_id
        return ItemRatingRepository.create(db, rating_dict)

    @staticmethod
    def get_ratings_by_item_id(db: Session, item_id: int, skip: int = 0, limit: int = 100) -> List[ItemRating]:
        return ItemRatingRepository.get_by_item_id(db, item_id, skip, limit)

    @staticmethod
    def get_avg_rating(db: Session, item_id: int) -> float:
        return ItemRatingRepository.get_avg_rating(db, item_id)

    @staticmethod
    def delete_rating(db: Session, rating_id: int, user_id: int):
        rating = ItemRatingRepository.get_by_id(db, rating_id)
        if not rating or rating.user_id != user_id:
            raise ResourceNotFoundException("Rating not found or permission denied")

        if not ItemRatingRepository.delete(db, rating_id):
            raise ResourceNotFoundException("Rating not found")

class UserFavoriteService:
    @staticmethod
    def toggle_favorite(db: Session, user_id: int, item_id: int) -> Tuple[bool, str]:
        item = ItemRepository.get_by_id(db, item_id)
        if not item:
            raise ValueError("Item not found")

        is_currently_favorite = UserFavoriteRepository.is_favorite(db, user_id, item_id)

        if is_currently_favorite:
            UserFavoriteRepository.remove_favorite(db, user_id, item_id)
            return False, "Removed from favorites"
        else:
            UserFavoriteRepository.add_favorite(db, user_id, item_id)
            return True, "Added to favorites"

    @staticmethod
    def get_user_favorites(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[UserFavorite]:
        return UserFavoriteRepository.get_user_favorites(db, user_id, skip, limit)

    @staticmethod
    def get_favorites_count(db: Session, user_id: int) -> int:
        return UserFavoriteRepository.get_favorites_count(db, user_id)

    @staticmethod
    def is_favorite(db: Session, user_id: int, item_id: int) -> bool:
        return UserFavoriteRepository.is_favorite(db, user_id, item_id)