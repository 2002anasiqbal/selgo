"use client";
import React, { useState, useEffect } from "react";
import SquareMain from "@/components/square/SquareMain";
import Page from "@/components/GenerateCard";
import RecommendedItems from "@/components/square/RecommendedItems";
import SquareFilter from "@/components/square/SquareFilter"; // Import the filter component
import squareService from "@/services/squareService"; // Import the square service

export default function Square() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    min_price: "",
    max_price: "",
    location: "",
  });

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const fetchedItems = await squareService.getItems(filters);
        setItems(fetchedItems);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div className="bg-white">
      <SquareMain />
      <div className="container mx-auto px-4">
        <h1 className="font-bold text-3xl text-gray-800 py-10">Find the items that suit you</h1>

        <SquareFilter filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="text-center py-10">Loading items...</div>
        ) : (
          <Page
            route="/routes/square"
            cards={items}
            disableAutoFetch={true}
          />
        )}

        <RecommendedItems />
      </div>
    </div>
  );
}
