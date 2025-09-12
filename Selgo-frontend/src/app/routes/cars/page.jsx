"use client";
import React, { useState, useEffect } from "react";
import CarMain from "@/components/cars/CarMain";
import Page from "@/components/GenerateCard";
import RecommendedCars from "@/components/cars/RecommendedCars";
import CarFilter from "@/components/cars/CarFilter"; // Import the filter component
import carService from "@/services/carService"; // Import the car service

export default function Car() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    min_year: "",
    max_year: "",
    min_price: "",
    max_price: "",
  });

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const fetchedCars = await carService.getCars(filters);
        setCars(fetchedCars);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div className="bg-white">
      <CarMain />
      <div className="container mx-auto px-4">
        <h1 className="font-bold text-3xl text-gray-800 py-10">Find the cars that suit you</h1>

        <CarFilter filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="text-center py-10">Loading cars...</div>
        ) : (
          <Page
            route="/routes/cars"
            cards={cars}
            disableAutoFetch={true}
          />
        )}

        <RecommendedCars />
      </div>
    </div>
  );
}
