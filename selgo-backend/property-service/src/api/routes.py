from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from ..database.database import get_database
from ..services.property_services import PropertyCategoryService, PropertyService
from ..models.property_schemas import (
    PropertyCategoryResponse, PropertyResponse,
    PropertyCreate, PropertyUpdate, PropertyFilterParams, PaginatedResponse
)
from ..utils.auth import get_current_user_id

router = APIRouter(prefix="/api/v1/properties", tags=["Properties"])

@router.get("/categories", response_model=List[PropertyCategoryResponse])
async def get_property_categories(
    db: Session = Depends(get_database)
):
    return PropertyCategoryService.get_all_categories(db)

@router.get("", response_model=List[PropertyResponse])
async def get_all_properties(
    property_type: str = Query(None),
    min_price: int = Query(None),
    max_price: int = Query(None),
    min_bedrooms: int = Query(None),
    max_bedrooms: int = Query(None),
    min_bathrooms: int = Query(None),
    max_bathrooms: int = Query(None),
    db: Session = Depends(get_database)
):
    filters = {
        "property_type": property_type,
        "min_price": min_price,
        "max_price": max_price,
        "min_bedrooms": min_bedrooms,
        "max_bedrooms": max_bedrooms,
        "min_bathrooms": min_bathrooms,
        "max_bathrooms": max_bathrooms,
    }
    properties = PropertyService.get_all_properties(db, filters)
    return properties

@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property_detail(
    property_id: UUID,
    db: Session = Depends(get_database)
):
    property_obj = PropertyService.get_property_by_id(db, str(property_id), increment_view=True)

    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )

    return property_obj

@router.post("", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    db: Session = Depends(get_database),
    current_user_id: str = Depends(get_current_user_id)
):
    try:
        property_obj = PropertyService.create_property(db, property_data, current_user_id)
        return property_obj
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating property: {str(e)}"
        )

@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: UUID,
    property_data: PropertyUpdate,
    db: Session = Depends(get_database),
    current_user_id: str = Depends(get_current_user_id)
):
    property_obj = PropertyService.update_property(db, str(property_id), property_data, current_user_id)

    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found or permission denied"
        )

    return property_obj

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: UUID,
    db: Session = Depends(get_database),
    current_user_id: str = Depends(get_current_user_id)
):
    success = PropertyService.delete_property(db, str(property_id), current_user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found or permission denied"
        )
    return {"detail": "Property deleted successfully"}