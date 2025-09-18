"use client";
import { useState } from "react";
import Image from "next/image";
import { FaFacebookF, FaDribbble, FaInstagram, FaTwitter, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 px-5">
      <div className="max-w-4xl mx-auto"> 
        {/* Logo - Centered on Small and Medium Screens */}
        <div className="flex flex-col items-center lg:hidden mb-8">
          <Image src="/assets/header/selgo.svg" alt="Company Logo" width={120} height={40} priority />
          <p className="text-gray-600 dark:text-gray-400 text-center mt-2">The market of opportunities</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-8 md:gap-x-8 md:gap-y-10 lg:gap-6">
          {/* Left Section (Logo) - Visible on Large Screens Only */}
          <div className="hidden lg:flex lg:col-span-4 flex-col items-start space-y-2">
            <Image src="/assets/header/selgo.svg" alt="Company Logo" width={120} height={40} priority />
            <p className="text-gray-600 dark:text-gray-400">The market of opportunities</p>
          </div>

          {/* Commercial Activities Section */}
          <div className="lg:col-span-2 md:text-center lg:text-left md:mx-auto md:max-w-xs">
            <div className="flex justify-between items-center cursor-pointer sm:cursor-pointer md:cursor-auto" onClick={() => toggleSection("commercial")}>
              <h3 className="text-gray-900 dark:text-white font-semibold">Commercial activities</h3>
              <span className="sm:block md:hidden">
                {expandedSection === "commercial" ? <FaChevronUp className="text-teal-800 dark:text-teal-400 "/> : <FaChevronDown className="text-teal-800 dark:text-teal-400 "/>}
              </span>
            </div>
            <ul className={`mt-3 space-y-2 text-gray-600 dark:text-gray-400 ${expandedSection === "commercial" ? "block" : "hidden sm:hidden md:block"}`}>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Become a business customer</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Information and inspiration</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Admin for Companies</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Releases</a></li>
            </ul>
          </div>

          {/* About Selgo Section */}
          <div className="lg:col-span-2 md:text-center lg:text-left md:mx-auto md:max-w-xs">
            <div className="flex justify-between items-center cursor-pointer sm:cursor-pointer md:cursor-auto" onClick={() => toggleSection("about")}>
              <h3 className="text-gray-900 dark:text-white font-semibold">About Selgo</h3>
              <span className="sm:block md:hidden">
                {expandedSection === "about" ? <FaChevronUp className="text-teal-800 dark:text-teal-400 " /> : <FaChevronDown className="text-teal-800 dark:text-teal-400 "/>}
              </span>
            </div>
            <ul className={`mt-3 space-y-2 text-gray-600 dark:text-gray-400 ${expandedSection === "about" ? "block" : "hidden sm:hidden md:block"}`}>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Work at Selgo</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Inspiration</a></li>
            </ul>
          </div>

          {/* Privacy Section */}
          <div className="lg:col-span-2 md:text-center lg:text-left md:mx-auto md:max-w-xs">
            <div className="flex justify-between items-center cursor-pointer sm:cursor-pointer md:cursor-auto" onClick={() => toggleSection("privacy")}>
              <h3 className="text-gray-900 dark:text-white font-semibold">Terms and Privacy</h3>
              <span className="sm:block md:hidden">
                {expandedSection === "privacy" ? <FaChevronUp className="text-teal-800 dark:text-teal-400 "/> : <FaChevronDown className="text-teal-800 dark:text-teal-400 "/>}
              </span>
            </div>
            <ul className={`mt-3 space-y-2 text-gray-600 dark:text-gray-400 ${expandedSection === "privacy" ? "block" : "hidden sm:hidden md:block"}`}>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy statement</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy in Selgo</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy settings</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Information cookies</a></li>
            </ul>
          </div>

          {/* Terms Section */}
          <div className="lg:col-span-2 md:text-center lg:text-left md:mx-auto md:max-w-xs">
            <div className="flex justify-between items-center cursor-pointer sm:cursor-pointer md:cursor-auto" onClick={() => toggleSection("terms")}>
              <h3 className="text-gray-900 dark:text-white font-semibold">Terms and Privacy</h3>
              <span className="sm:block md:hidden">
                {expandedSection === "terms" ? <FaChevronUp className="text-teal-800 dark:text-teal-400 "/> : <FaChevronDown className="text-teal-800 dark:text-teal-400 "/>}
              </span>
            </div>
            <ul className={`mt-3 space-y-2 text-gray-600 dark:text-gray-400 ${expandedSection === "terms" ? "block" : "hidden sm:hidden md:block"}`}>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Customer Service</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Secure Trading</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Fix finished</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Term of use</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Advertising rules</a></li>
              <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Availability</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 dark:text-gray-400 text-sm">© 2025 XYZ Company. All rights reserved</p>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors">
              <FaFacebookF className="text-teal-800 dark:text-teal-400 " size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors">
              <FaDribbble className="text-teal-800 dark:text-teal-400 " size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors">
              <FaInstagram className="text-teal-800 dark:text-teal-400 " size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors">
              <FaTwitter className="text-teal-800 dark:text-teal-400 " size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;