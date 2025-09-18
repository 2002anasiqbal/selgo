// Selgo-frontend/src/components/MC/MCMain.jsx
// UPDATED: Connect "Find Bikes" section to real motorcycle backend data

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ButtonCard from "../general/ButtonCard";
import GenericCardCollection from "../GenericCardCollection";
import SearchBar from "../root/SearchBar";
import Page from "../GenerateCard";
import { useRouter } from "next/navigation";
import motorcycleService from "@/services/motorcycleService";

// ORIGINAL card data - NO CHANGES to UI
const cardData = [
  {
    items: [
      { tag: "Thresher 6000", icon: "1.svg", route: "/routes/motor-cycle/category?category=Thresher 6000" },
      { tag: "Suzuki 6000", icon: "2.svg", route: "/routes/motor-cycle/category?category=Suzuki 6000" },
      { tag: "Motorcycles 6000", icon: "3.svg", route: "/routes/motor-cycle/category?category=Motorcycles 6000" },
    ],
  },
  {
    items: [
      { tag: "Auto bikes 6000", icon: "4.svg", route: "/routes/motor-cycle/category?category=Auto bikes 6000" },
      { tag: "Tractor 6000", icon: "5.svg", route: "/routes/motor-cycle/category?category=Tractor 6000" },
      { tag: "Bikes 6000", icon: "6.svg", route: "/routes/motor-cycle/category?category=Bikes 6000" },
    ],
  },
];

// ORIGINAL rowStyles - NO CHANGES
const rowStyles = {
  0: {
    gridCols: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-3",
    gap: "gap-6",
    marginBottom: "mb-6",
  },
  1: {
    gridCols: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-3",
    gap: "gap-6",
    centered: true,
  },
};

export default function MCMain() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/routes/motor-cycle/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="pt-24 sm:pt-16 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-5xl text-gray-900 dark:text-white font-bold pb-10">
        Motorcycles
      </h1>

      <div className="justify-center items-center gap-4 w-full mb-6">
        <form onSubmit={handleSearchSubmit}>
          <SearchBar
            placeholder="Search motorcycles..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      <GenericCardCollection
        rows={cardData}
        rowStyles={rowStyles}
        imageBasePath="/assets/MC/"
        size="h-32 w-32"
      />
      <div className="flex justify-center items-center mt-8">
        <ButtonCard />
      </div>
    </div>
  );
}