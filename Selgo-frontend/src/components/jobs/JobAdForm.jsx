"use client";
import React, { useState, useEffect } from 'react';
import jobService from '@/services/jobService';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/store';

const JobAdForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    company_id: '',
    category_id: '',
    job_type: 'full_time',
    experience_level: 'mid_level',
    salary_min: '',
    salary_max: '',
    location: '',
    is_remote: false,
    application_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, companiesData] = await Promise.all([
          jobService.getJobCategories(),
          jobService.getCompanies(),
        ]);
        setCategories(categoriesData);
        setCompanies(companiesData);
      } catch (err) {
        console.error('Failed to fetch categories or companies', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await jobService.createJob(formData);
      console.log('Job created:', response);
      router.push(`/routes/jobs/${response.id}`);
    } catch (err) {
      setError('Failed to create job ad. Please check the form and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">Short Description</label>
        <input type="text" name="short_description" id="short_description" value={formData.short_description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Company</label>
        <select name="company_id" id="company_id" value={formData.company_id} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Select a company</option>
          {companies.map(comp => <option key={comp.id} value={comp.id}>{comp.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
        <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Select a category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">Job Type</label>
        <select name="job_type" id="job_type" value={formData.job_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="full_time">Full Time</option>
          <option value="part_time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
      </div>
      <div>
        <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">Experience Level</label>
        <select name="experience_level" id="experience_level" value={formData.experience_level} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="entry_level">Entry Level</option>
          <option value="mid_level">Mid Level</option>
          <option value="senior_level">Senior Level</option>
          <option value="director">Director</option>
          <option value="executive">Executive</option>
        </select>
      </div>
      <div>
        <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700">Minimum Salary</label>
        <input type="number" name="salary_min" id="salary_min" value={formData.salary_min} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700">Maximum Salary</label>
        <input type="number" name="salary_max" id="salary_max" value={formData.salary_max} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="is_remote" id="is_remote" checked={formData.is_remote} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
        <label htmlFor="is_remote" className="ml-2 block text-sm text-gray-900">Remote</label>
      </div>
      <div>
        <label htmlFor="application_url" className="block text-sm font-medium text-gray-700">Application URL</label>
        <input type="url" name="application_url" id="application_url" value={formData.application_url} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div>
        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {loading ? 'Creating...' : 'Create Ad'}
        </button>
      </div>
    </form>
  );
};

export default JobAdForm;
