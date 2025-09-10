from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ..database.database import get_database
from ..services.property_services import PropertyCategoryService, PropertyService, ResourceNotFoundException
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

@router.get("/categories/{category_id}", response_model=PropertyCategoryResponse)
async def get_property_category(
    category_id: int,
    db: Session = Depends(get_database)
):
    try:
        return PropertyCategoryService.get_category_by_id(db, category_id)
    except ResourceNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/categories/{category_id}", response_model=PropertyCategoryResponse)
async def update_property_category(
    category_id: int,
    category_data: PropertyCategoryCreate,
    db: Session = Depends(get_database)
):
    try:
        return PropertyCategoryService.update_category(db, category_id, category_data)
    except ResourceNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property_category(
    category_id: int,
    db: Session = Depends(get_database)
):
    try:
        PropertyCategoryService.delete_category(db, category_id)
        return {"detail": "Category deleted successfully"}
    except ResourceNotFoundException as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/filter", response_model=PaginatedResponse)
async def filter_properties(
    filters: PropertyFilterParams,
    db: Session = Depends(get_database)
):
    properties, total = PropertyService.filter_properties(db, filters)
    return PaginatedResponse(
        items=properties,
        total=total,
        limit=filters.limit,
        offset=filters.offset
    )

@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property_detail(
    property_id: UUID,
    db: Session = Depends(get_database)
):
    try:
        property_obj = PropertyService.get_property_by_id(db, str(property_id), increment_view=True)
        return property_obj
    except ResourceNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

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
    try:
        property_obj = PropertyService.update_property(db, str(property_id), property_data, current_user_id)
        return property_obj
    except ResourceNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property(
    property_id: UUID,
    db: Session = Depends(get_database),
    current_user_id: str = Depends(get_current_user_id)
):
    try:
        PropertyService.delete_property(db, str(property_id), current_user_id)
        return {"detail": "Property deleted successfully"}
    except ResourceNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )