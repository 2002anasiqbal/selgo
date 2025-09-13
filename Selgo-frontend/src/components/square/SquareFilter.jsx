// Selgo-frontend/src/components/square/SquareFilter.jsx
"use client";
import React from 'react';

const SquareFilter = ({ filters, onFilterChange }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    // In a real app, these categories would likely come from an API
    const categories = [
        "Electronics", "Furniture", "Clothing", "Books", "Sports", "Other"
    ];

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category */}
                <div className="flex flex-col">
                    <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={filters.category}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
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
                        placeholder="e.g., 10"
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
                        placeholder="e.g., 500"
                        value={filters.max_price}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                {/* Location */}
                <div className="flex flex-col">
                    <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="e.g., New York"
                        value={filters.location}
                        onChange={handleInputChange}
                        className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default SquareFilter;
