// Selgo-frontend/src/components/cars/CarFilter.jsx
"use client";
import React from 'react';

const CarFilter = ({ filters, onFilterChange }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Make */}
                <div className="flex flex-col">
                    <label htmlFor="make" className="text-sm font-medium text-gray-700 mb-1">Make</label>
                    <input
                        type="text"
                        id="make"
                        name="make"
                        placeholder="e.g., Toyota"
                        value={filters.make}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                {/* Model */}
                <div className="flex flex-col">
                    <label htmlFor="model" className="text-sm font-medium text-gray-700 mb-1">Model</label>
                    <input
                        type="text"
                        id="model"
                        name="model"
                        placeholder="e.g., Camry"
                        value={filters.model}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                {/* Year Range */}
                <div className="flex flex-col">
                    <label htmlFor="min_year" className="text-sm font-medium text-gray-700 mb-1">Min Year</label>
                    <input
                        type="number"
                        id="min_year"
                        name="min_year"
                        placeholder="e.g., 2010"
                        value={filters.min_year}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="max_year" className="text-sm font-medium text-gray-700 mb-1">Max Year</label>
                    <input
                        type="number"
                        id="max_year"
                        name="max_year"
                        placeholder="e.g., 2022"
                        value={filters.max_year}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                {/* Price Range */}
                <div className="flex flex-col">
                    <label htmlFor="min_price" className="text-sm font-medium text-gray-700 mb-1">Min Price</label>
                    <input
                        type="number"
                        id="min_price"
                        name="min_price"
                        placeholder="e.g., 5000"
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
                        placeholder="e.g., 25000"
                        value={filters.max_price}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default CarFilter;
