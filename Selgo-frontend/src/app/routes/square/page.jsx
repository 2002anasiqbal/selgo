import SquareMain from "@/components/square/SquareMain";
import Page from "@/components/GenerateCard";
import RecommendedItems from "@/components/square/RecommendedItems";
import Link from 'next/link';

export default function Square() {
  return (
    <div className="bg-white">
      <SquareMain />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-10">
          <h1 className="font-bold text-3xl text-gray-800">Find the items that suit you</h1>
          <Link href="/routes/square/create-ad">
            <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition">
              Create Ad
            </button>
          </Link>
        </div>

        <Page route="/routes/square" />

        <RecommendedItems />
      </div>
    </div>
  );
}
