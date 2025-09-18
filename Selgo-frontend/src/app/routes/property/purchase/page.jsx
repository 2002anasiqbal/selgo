"use client";
import React, { useState, useEffect } from "react";
import Page from "@/components/GenerateCard";
import Sidebar from "@/components/general/Sidebar";
import propertyService from "@/services/propertyService";

export default function PurchasePage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    const searchProperties = async (filters) => {
        try {
            setLoading(true);
            const response = await propertyService.searchProperties(filters);
            setProperties(response.items || []);
            setTotalResults(response.total || 0);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchProperties({ property_type: 'purchase' });
    }, []);

    const handleFilterChange = (newFilters) => {
        searchProperties({ ...newFilters, property_type: 'purchase' });
    };

    return (
        <div className="bg-white w-full">
            <div className="flex flex-1 relative">
                <div className="md:w-1/4 z-10 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto hide-scrollbar">
                    <Sidebar onFilterChange={handleFilterChange} />
                </div>
                <div className="flex-1 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto hide-scrollbar">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="font-bold text-3xl text-gray-800">Properties for Sale</h1>
                        <p className="text-gray-600">
                            {loading ? "Searching..." : `${totalResults} results found`}
                        </p>
                        {loading ? (
                            <div className="text-center py-10">Loading properties...</div>
                        ) : (
                            <Page
                                columns={3}
                                route="/routes/property/property-details"
                                cards={properties}
                                disableAutoFetch={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}