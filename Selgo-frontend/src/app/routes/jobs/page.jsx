import JobMain from "@/components/jobs/JobsMain";
import Link from 'next/link';

export default function Jobs() {
    return (
      <div>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-10">
            <h1 className="font-bold text-3xl text-gray-800">Jobs</h1>
            <Link href="/routes/jobs/create-ad">
              <button className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition">
                Create Ad
              </button>
            </Link>
          </div>
        </div>
        <JobMain />
      </div>
    );
  }