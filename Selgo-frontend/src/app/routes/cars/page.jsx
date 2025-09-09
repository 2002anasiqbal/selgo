import CarMain from "@/components/cars/CarMain";
import Page from "@/components/GenerateCard";
import RecommendedCars from "@/components/cars/RecommendedCars";
import Link from 'next/link';

export default function Car() {
  return (
    <div className="bg-white">
      <CarMain />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-10">
          <h1 className="font-bold text-3xl text-gray-800">Find the cars that suit you</h1>
          <Link href="/routes/cars/create-ad">
            <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition">
              Create Ad
            </button>
          </Link>
        </div>

        <Page route="/routes/cars" />

        <RecommendedCars />
      </div>
    </div>
  );
}
