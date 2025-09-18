"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Page from "@/components/GenerateCard";
import SearchBar from "@/components/root/SearchBar";
import Sidebar from "@/components/general/Sidebar";
import motorcycleService from "@/services/motorcycleService";

const MotorcycleSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);
  const [totalResults, setTotalResults] = useState(0);

  const searchMotorcycles = async (filters) => {
    try {
      setLoading(true);
      const response = await motorcycleService.filterMotorcycles(filters);
      setMotorcycles(response.items || []);
      setTotalResults(response.total || 0);
    } catch (error) {
      console.error("Error searching motorcycles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialFilters = {
      search_term: query,
      limit: 20,
      offset: 0,
    };
    searchMotorcycles(initialFilters);
  }, [query]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/routes/motor-cycle/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleFilterChange = (newFilters) => {
    const updatedFilters = {
      ...newFilters,
      search_term: searchTerm,
      limit: 20,
      offset: 0,
    };
    searchMotorcycles(updatedFilters);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white p-6 border-b">
        <form onSubmit={handleSearchSubmit}>
          <SearchBar
            placeholder="Search motorcycles..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </form>
        <div className="mt-4">
          <h1 className="text-2xl font-bold">
            {query ? `Search results for "${query}"` : "Search Motorcycles"}
          </h1>
          <p className="text-gray-600">
            {loading ? "Searching..." : `${totalResults} results found`}
          </p>
        </div>
      </div>
      <div className="flex flex-1 relative">
        <div className="md:w-1/4 z-10 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto hide-scrollbar">
          <Sidebar onFilterChange={handleFilterChange} />
        </div>
        <div className="flex-1 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto hide-scrollbar">
          <div className="container mx-auto px-4 py-8">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <p>Loading results...</p>
              </div>
            ) : motorcycles.length > 0 ? (
              <Page columns={3} cards={motorcycles} route="/routes/motor-cycle" />
            ) : (
              <div className="text-center py-10">
                <h2 className="text-xl font-semibold">No motorcycles found</h2>
                <p className="mt-2 text-gray-600">
                  Try adjusting your search terms or browse categories instead.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MotorcycleSearchPage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <MotorcycleSearch />
    </Suspense>
);

export default MotorcycleSearchPage;
