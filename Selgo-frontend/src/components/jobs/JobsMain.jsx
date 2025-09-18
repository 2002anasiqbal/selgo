// selgo-frontend/components/jobs/JobsMain.jsx
"use client";

import SearchBar from "../root/SearchBar";
import LeftAlignedCard from "./LeftAlignedCard";
import Image from "next/image";
import ArticleCard from "./ArticleCard";
import PopularSearches from "./PopularSearches";
import RecommendationJobCard from "./RecommendationJobCard";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import jobService from "../../../services/jobService";
import Link from "next/link";

const cardData = [
    {
        icon: "/assets/jobs/1.svg",
        label: "Your Job Profile",
        title: "Find your dream job",
        subtitle: "There are 43,486 positions on FINN.no right now.",
        route: "/routes/jobs/job-profile"
    },
    {
        icon: "/assets/jobs/2.svg",
        label: "Wages",
        title: "Compare your salary",
        subtitle: "Compare your salary with other peoples.",
        route: "/routes/jobs/salary"
    },
    {
        icon: "/assets/jobs/3.svg",
        label: "Resume",
        title: "Create a brand new CV",
        subtitle: "Create a brand new and updated CV quickly and easily",
        route: "/routes/jobs/cv-builder"
    }
];

const articles = [
    {
        imageUrl: "/assets/jobs/7.svg",
        title: "Top 5 in demand occupation right now",
    },
    {
        imageUrl: "/assets/jobs/8.svg",
        title: "Part time job is full of opportunities",
    },
    {
        imageUrl: "/assets/jobs/6.svg",
        title: "How to write a good job application",
    },
];

const searches = [
    {
        title: "Positions",
        list: [
            "Nurse",
            "Engineer",
            "Social worker and environmental therapist",
            "Teacher and principal",
            "IT development",
        ],
    },
    {
        title: "Places",
        list: ["Oslo", "Bergen", "Trondhim", "Stavangar", "Tromsø"],
    },
    {
        title: "Articles",
        list: ["Tips and advice", "Job applications", "Tip and cv", "CV templates", "Wages"],
    },
];

export default function JobMain() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [jobRecommendations, setJobRecommendations] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await jobService.searchJobs({ limit: 4 });
                const jobs = response.jobs.map(job => ({
                    imageUrl: job.company.logo_url || "/assets/jobs/5.svg",
                    jobTitle: job.title,
                    companyName: job.company.name,
                    description: job.short_description,
                    location: job.location,
                }));
                setJobRecommendations(jobs);
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    const handleCardClick = (index) => {
        const card = cardData[index];
        if (card.route) {
            router.push(card.route);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <div className="my-10 w-full flex justify-center items-center gap-4">
                <SearchBar 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Link href="/routes/create-ad/job" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create Job Post
                </Link>
            </div>
            
            {/* Top Banner */}
            <div className="bg-teal-700 dark:bg-teal-800 text-white py-6 sm:py-8 text-center px-4">
                <h1 className="text-xl sm:text-2xl font-semibold mb-2">Is Monday coming a little too soon?</h1>
                <p>Do something about it, at FINN we have 43,486 vacancies</p>
            </div>

            {/* Main Card Section - NOW WITH CLICK HANDLERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-6 sm:py-8">
                {cardData.map((card, index) => (
                    <LeftAlignedCard
                        key={index}
                        icon={card.icon}
                        label={card.label}
                        title={card.title}
                        subtitle={card.subtitle}
                        onClick={() => handleCardClick(index)}
                    />
                ))}
            </div>

            {/* Rest of the component remains the same... */}
            <div className="mb-8 sm:mb-10">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
                    <Image src="/assets/jobs/4.svg" alt="clock" width={18} height={18} />
                    Last viewed
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Continue where you last left off</p>
                <div className="h-24 sm:h-28 border dark:border-gray-700 rounded-md flex items-center justify-center gap-3 sm:gap-5 text-gray-400 dark:text-gray-500 text-xs sm:text-sm px-4 text-center">
                    <Image src="/assets/jobs/5.svg" alt="clock" width={60} height={60} className="hidden sm:block" />
                    <Image src="/assets/jobs/5.svg" alt="clock" width={40} height={40} className="sm:hidden" />
                    Your most recently placed ads will appear here
                </div>
            </div>

            <div className="mb-8 sm:mb-10">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
                    <Image src="/assets/jobs/6.svg" alt="heart" width={18} height={18} />
                    Recommendations for you
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Based on your preferences, these may suit you
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border dark:border-gray-700 rounded-md p-4 sm:p-6 flex flex-col justify-between items-center text-center bg-white dark:bg-gray-800 shadow-sm h-full">
                        <div className="flex flex-col items-center justify-center flex-1">
                            <Image src="/assets/jobs/7.svg" alt="rec" width={60} height={60} className="sm:w-[70px] sm:h-[70px]" />
                            <p className="font-medium mt-3 sm:mt-4 text-gray-800 dark:text-white">Your recommendations</p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                                In order to show you personalized recommendations, we need to know a little more about you and your skills
                            </p>
                        </div>
                        <button 
                            className="bg-teal-600 text-white px-4 py-2 rounded-md w-full text-sm mt-4 sm:mt-6"
                            onClick={() => router.push('/routes/jobs/job-profile')}
                        >
                            Start
                        </button>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {jobRecommendations.map((job, idx) => (
                            <RecommendationJobCard key={idx} {...job} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Salary Banner - MAKE IT CLICKABLE */}
            <div className="bg-teal-700 dark:bg-teal-800 text-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center rounded-md">
                <div className="flex flex-col sm:flex-row px-3 sm:px-5 py-4 sm:py-0 sm:h-24 rounded-sm justify-center w-full mx-auto bg-white dark:bg-gray-800 items-center gap-3 mb-4 sm:mb-0">
                    <Image src="/assets/jobs/2.svg" alt="compare" width={50} height={50} className="sm:w-[60px] sm:h-[60px]" />
                    <div className="text-center sm:text-left">
                        <p className="font-medium text-gray-900 dark:text-white">Compare your salary</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Are you getting what you deserve in your current position?</p>
                    </div>
                    <button 
                        className="text-white bg-teal-700 px-4 py-2 rounded-md font-semibold text-sm mt-3 sm:mt-0"
                        onClick={() => router.push('/routes/jobs/salary')}
                    >
                        Compare salaries
                    </button>
                </div>
            </div>

            <div className="w-full py-10">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Useful articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mx-auto mb-8 sm:mb-10">
                    {articles.map((article, index) => (
                        <ArticleCard
                            key={index}
                            imageUrl={article.imageUrl}
                            title={article.title}
                            onClick={() => { }}
                        />
                    ))}
                </div>

                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Popular searches</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-16 lg:gap-28">
                    {searches.map((search, index) => (
                        <PopularSearches key={index} title={search.title} list={search.list} />
                    ))}
                </div>
            </div>
        </div>
    );
}