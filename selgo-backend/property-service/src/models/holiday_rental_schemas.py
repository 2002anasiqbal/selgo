# property-service/src/models/holiday_rental_schemas.py
from pydantic import BaseModel, validator, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from decimal import Decimal
from uuid import UUID
import enum

class HolidayRentalTypeEnum(str, enum.Enum):
    CABIN = "cabin"
    COTTAGE = "cottage"
    CHALET = "chalet"
    VILLA = "villa"
    APARTMENT = "apartment"
    HOUSE = "house"
    BOAT = "boat"
    CAMPING = "camping"
    GLAMPING = "glamping"

class SeasonEnum(str, enum.Enum):
    SPRING = "spring"
    SUMMER = "summer"
    AUTUMN = "autumn"
    WINTER = "winter"
    ALL_YEAR = "all_year"

class BookingStatusEnum(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    NO_SHOW = "no_show"

class CancellationPolicyEnum(str, enum.Enum):
    FLEXIBLE = "flexible"
    MODERATE = "moderate"
    STRICT = "strict"

# Holiday Rental Schemas
class HolidayRentalBase(BaseModel):
    rental_type: HolidayRentalTypeEnum
    max_guests: int
    min_nights: int = 1
    max_nights: Optional[int] = None
    price_per_night: Decimal
    cleaning_fee: Decimal = 0
    security_deposit: Decimal = 0
    extra_guest_fee: Decimal = 0
    pet_fee: Decimal = 0
    summer_price_per_night: Optional[Decimal] = None
    winter_price_per_night: Optional[Decimal] = None
    weekend_surcharge: Decimal = 0
    holiday_surcharge: Decimal = 0
    available_seasons: Optional[str] = None
    check_in_time: str = "15:00"
    check_out_time: str = "11:00"
    instant_booking: bool = False
    
    # Amenities
    has_wifi: bool = False
    has_kitchen: bool = False
    has_washing_machine: bool = False
    has_dishwasher: bool = False
    has_tv: bool = False
    has_heating: bool = False
    has_air_conditioning: bool = False
    has_hot_tub: bool = False
    has_sauna: bool = False
    has_fireplace: bool = False
    has_bbq: bool = False
    has_boat_access: bool = False
    has_ski_access: bool = False
    has_beach_access: bool = False
    
    # Policies
    pets_allowed: bool = False
    smoking_allowed: bool = False
    parties_allowed: bool = False
    children_welcome: bool = True
    
    # Location Features
    distance_to_water: Optional[float] = None
    distance_to_ski_lift: Optional[float] = None
    distance_to_town_center: Optional[float] = None
    distance_to_grocery_store: Optional[float] = None
    
    # Booking Policies
    cancellation_policy: CancellationPolicyEnum = CancellationPolicyEnum.MODERATE
    advance_booking_days: int = 1

    @validator('max_guests')
    def validate_max_guests(cls, v):
        if v <= 0:
            raise ValueError('Max guests must be greater than 0')
        return v

    @validator('min_nights')
    def validate_min_nights(cls, v):
        if v <= 0:
            raise ValueError('Min nights must be greater than 0')
        return v

    @validator('price_per_night')
    def validate_price_per_night(cls, v):
        if v <= 0:
            raise ValueError('Price per night must be greater than 0')
        return v

class HolidayRentalCreate(HolidayRentalBase):
    property_id: UUID

class HolidayRentalUpdate(BaseModel):
    rental_type: Optional[HolidayRentalTypeEnum] = None
    max_guests: Optional[int] = None
    min_nights: Optional[int] = None
    max_nights: Optional[int] = None
    price_per_night: Optional[Decimal] = None
    cleaning_fee: Optional[Decimal] = None
    security_deposit: Optional[Decimal] = None
    extra_guest_fee: Optional[Decimal] = None
    pet_fee: Optional[Decimal] = None
    summer_price_per_night: Optional[Decimal] = None
    winter_price_per_night: Optional[Decimal] = None
    weekend_surcharge: Optional[Decimal] = None
    holiday_surcharge: Optional[Decimal] = None
    available_seasons: Optional[str] = None
    check_in_time: Optional[str] = None
    check_out_time: Optional[str] = None
    instant_booking: Optional[bool] = None
    
    # Amenities
    has_wifi: Optional[bool] = None
    has_kitchen: Optional[bool] = None
    has_washing_machine: Optional[bool] = None
    has_dishwasher: Optional[bool] = None
    has_tv: Optional[bool] = None
    has_heating: Optional[bool] = None
    has_air_conditioning: Optional[bool] = None
    has_hot_tub: Optional[bool] = None
    has_sauna: Optional[bool] = None
    has_fireplace: Optional[bool] = None
    has_bbq: Optional[bool] = None
    has_boat_access: Optional[bool] = None
    has_ski_access: Optional[bool] = None
    has_beach_access: Optional[bool] = None
    
    # Policies
    pets_allowed: Optional[bool] = None
    smoking_allowed: Optional[bool] = None
    parties_allowed: Optional[bool] = None
    children_welcome: Optional[bool] = None
    
    # Location Features
    distance_to_water: Optional[float] = None
    distance_to_ski_lift: Optional[float] = None
    distance_to_town_center: Optional[float] = None
    distance_to_grocery_store: Optional[float] = None
    
    # Booking Policies
    cancellation_policy: Optional[CancellationPolicyEnum] = None
    advance_booking_days: Optional[int] = None
    is_active: Optional[bool] = None

class HolidayRentalResponse(HolidayRentalBase):
    id: UUID
    property_id: UUID
    owner_id: UUID
    is_active: bool
    is_featured: bool
    total_bookings: int
    average_rating: Decimal
    review_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Booking Schemas
class HolidayRentalBookingBase(BaseModel):
    check_in_date: date
    check_out_date: date
    guests: int
    adults: int
    children: int = 0
    infants: int = 0
    pets: int = 0
    guest_name: str
    guest_email: EmailStr
    guest_phone: Optional[str] = None
    special_requests: Optional[str] = None

    @validator('check_out_date')
    def validate_dates(cls, v, values):
        if 'check_in_date' in values and v <= values['check_in_date']:
            raise ValueError('Check-out date must be after check-in date')
        return v

    @validator('guests')
    def validate_guests(cls, v):
        if v <= 0:
            raise ValueError('Number of guests must be greater than 0')
        return v

class HolidayRentalBookingCreate(HolidayRentalBookingBase):
    holiday_rental_id: UUID

class HolidayRentalBookingResponse(HolidayRentalBookingBase):
    id: UUID
    holiday_rental_id: UUID
    guest_id: UUID
    nights: int
    base_price: Decimal
    cleaning_fee: Decimal
    security_deposit: Decimal
    extra_fees: Decimal
    total_price: Decimal
    status: BookingStatusEnum
    payment_status: str
    confirmation_code: Optional[str]
    created_at: datetime
    updated_at: datetime
    confirmed_at: Optional[datetime]
    cancelled_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class HolidayRentalBookingListResponse(BaseModel):
    bookings: List[HolidayRentalBookingResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

# Review Schemas
class HolidayRentalReviewBase(BaseModel):
    rating: int
    title: Optional[str] = None
    comment: Optional[str] = None
    cleanliness_rating: Optional[int] = None
    location_rating: Optional[int] = None
    value_rating: Optional[int] = None
    communication_rating: Optional[int] = None
    check_in_rating: Optional[int] = None
    accuracy_rating: Optional[int] = None

    @validator('rating')
    def validate_rating(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Rating must be between 1 and 5')
        return v

class HolidayRentalReviewCreate(HolidayRentalReviewBase):
    booking_id: UUID

class HolidayRentalReviewResponse(HolidayRentalReviewBase):
    id: UUID
    holiday_rental_id: UUID
    booking_id: UUID
    reviewer_id: UUID
    is_approved: bool
    is_featured: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Availability Schemas
class HolidayRentalAvailabilityBase(BaseModel):
    start_date: date
    end_date: date
    is_available: bool = True
    price_per_night: Optional[Decimal] = None
    min_nights: Optional[int] = None
    reason: Optional[str] = None
    notes: Optional[str] = None

    @validator('end_date')
    def validate_dates(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('End date must be after start date')
        return v

class HolidayRentalAvailabilityCreate(HolidayRentalAvailabilityBase):
    holiday_rental_id: UUID

class HolidayRentalAvailabilityResponse(HolidayRentalAvailabilityBase):
    id: UUID
    holiday_rental_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Search and Filter Schemas
class HolidayRentalSearchFilters(BaseModel):
    rental_type: Optional[List[HolidayRentalTypeEnum]] = None
    min_guests: Optional[int] = None
    max_guests: Optional[int] = None
    price_from: Optional[Decimal] = None
    price_to: Optional[Decimal] = None
    check_in_date: Optional[date] = None
    check_out_date: Optional[date] = None
    min_nights: Optional[int] = None
    max_nights: Optional[int] = None
    location: Optional[str] = None
    has_wifi: Optional[bool] = None
    has_kitchen: Optional[bool] = None
    has_hot_tub: Optional[bool] = None
    has_sauna: Optional[bool] = None
    has_boat_access: Optional[bool] = None
    has_ski_access: Optional[bool] = None
    has_beach_access: Optional[bool] = None
    pets_allowed: Optional[bool] = None
    instant_booking: Optional[bool] = None
    min_rating: Optional[Decimal] = None

class HolidayRentalSearchRequest(BaseModel):
    query: Optional[str] = None
    filters: Optional[HolidayRentalSearchFilters] = None
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = "desc"
    page: int = 1
    per_page: int = 20

class HolidayRentalListResponse(BaseModel):
    rentals: List[HolidayRentalResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

# Statistics Schemas
class HolidayRentalStats(BaseModel):
    total_rentals: int
    active_rentals: int
    total_bookings: int
    confirmed_bookings: int
    average_price: Decimal
    average_rating: Decimal
    popular_locations: List[Dict[str, Any]]
    bookings_by_type: Dict[str, int]
    seasonal_trends: Dict[str, Any]