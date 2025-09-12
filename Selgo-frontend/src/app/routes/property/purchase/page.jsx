// Selgo-frontend/src/app/routes/property/purchase/page.jsx (Refactored for Filtering)
"use client";
import React, { useState, useEffect } from "react";
import Page from "@/components/GenerateCard";
import Purchase from "@/components/property/Purchase";
import PropertyFilter from "@/components/property/PropertyFilter"; // Import the filter component
import propertyService from "@/services/propertyService";

export default function PurchasePage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        property_type: "",
        min_price: "",
        max_price: "",
        min_bedrooms: "",
        max_bedrooms: "",
        min_bathrooms: "",
        max_bathrooms: "",
        // Add other filters as needed
    });

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                // Pass the current filters to the service
                const fetchedProperties = await propertyService.getProperties(filters);
                setProperties(fetchedProperties);
            } catch (error) {
                console.error('Failed to fetch properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [filters]); // Refetch when filters change

    const handleFilterChange = (newFilters) => {
        setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    };

    return (
        <div className="bg-white w-full">
            <Purchase />

            {/* Filter Section */}
            <div className="container mx-auto px-4 py-6">
                <PropertyFilter filters={filters} onFilterChange={handleFilterChange} />
            </div>

            {/* Property Listing Section */}
            <div className="container mx-auto px-4">
                <h1 className="font-bold text-3xl text-gray-800 mb-6">Properties for Sale</h1>
                {loading ? (
                    <div className="text-center py-10">Loading properties...</div>
                ) : (
                    <Page
                        columns={4} // Adjust columns as needed
                        route="/routes/property/property-details"
                        cards={properties}
                        disableAutoFetch={true} // Important: Prevent dual fetching
                    />
                )}
            </div>
        </div>
    );
}