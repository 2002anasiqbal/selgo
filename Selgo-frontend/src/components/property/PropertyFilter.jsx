// Selgo-frontend/src/components/property/PropertyFilter.jsx
"use client";
import React from 'react';

const PropertyFilter = ({ filters, onFilterChange }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    const propertyTypes = [
        "Apartment", "House", "Condo", "Townhouse", "Duplex", "Villa", "Other"
    ];

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Property Type */}
                <div className="flex flex-col">
                    <label htmlFor="property_type" className="text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <select
                        id="property_type"
                        name="property_type"
                        value={filters.property_type}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                        <option value="">All Types</option>
                        {propertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div className="flex flex-col">
                    <label htmlFor="min_price" className="text-sm font-medium text-gray-700 mb-1">Min Price</label>
                    <input
                        type="number"
                        id="min_price"
                        name="min_price"
                        placeholder="e.g., 100000"
                        value={filters.min_price}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="max_price" className="text-sm font-medium text-gray-700 mb-1">Max Price</label>
                    <input
                        type="number"
                        id="max_price"
                        name="max_price"
                        placeholder="e.g., 500000"
                        value={filters.max_price}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                {/* Bedrooms Range */}
                <div className="flex flex-col">
                    <label htmlFor="min_bedrooms" className="text-sm font-medium text-gray-700 mb-1">Min Bedrooms</label>
                    <input
                        type="number"
                        id="min_bedrooms"
                        name="min_bedrooms"
                        placeholder="e.g., 1"
                        value={filters.min_bedrooms}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                 <div className="flex flex-col">
                    <label htmlFor="max_bedrooms" className="text-sm font-medium text-gray-700 mb-1">Max Bedrooms</label>
                    <input
                        type="number"
                        id="max_bedrooms"
                        name="max_bedrooms"
                        placeholder="e.g., 5"
                        value={filters.max_bedrooms}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                {/* Bathrooms Range */}
                <div className="flex flex-col">
                    <label htmlFor="min_bathrooms" className="text-sm font-medium text-gray-700 mb-1">Min Bathrooms</label>
                    <input
                        type="number"
                        id="min_bathrooms"
                        name="min_bathrooms"
                        placeholder="e.g., 1"
                        value={filters.min_bathrooms}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                 <div className="flex flex-col">
                    <label htmlFor="max_bathrooms" className="text-sm font-medium text-gray-700 mb-1">Max Bathrooms</label>
                    <input
                        type="number"
                        id="max_bathrooms"
                        name="max_bathrooms"
                        placeholder="e.g., 3"
                        value={filters.max_bathrooms}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default PropertyFilter;
