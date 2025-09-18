"use client"
import React, { useState, useEffect } from 'react';
import jobService from '../../../../services/jobService';
import { useRouter } from 'next/navigation';

const CreateJobAd = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_type: 'full_time',
    experience_level: 'mid',
    location: '',
    is_remote: false,
    company_id: '',
    category_id: '',
    application_email: ''
  });
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, categoriesData] = await Promise.all([
          jobService.getCompanies(),
          jobService.getJobCategories()
        ]);
        setCompanies(companiesData.items || companiesData);
        setCategories(categoriesData);
        if (companiesData.items?.length > 0) {
          setFormData(prev => ({ ...prev, company_id: companiesData.items[0].id }));
        }
        if (categoriesData?.length > 0) {
          setFormData(prev => ({ ...prev, category_id: categoriesData[0].id }));
        }
      } catch (error) {
        console.error('Failed to fetch companies or categories:', error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const jobData = {
        ...formData,
        company_id: parseInt(formData.company_id),
        category_id: parseInt(formData.category_id),
      };
      const newJob = await jobService.createJob(jobData);
      setMessage(`Job created successfully! Job ID: ${newJob.id}`);
      router.push('/routes/jobs');
    } catch (error) {
      setMessage('Failed to create job. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Job Post</h1>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">Job Type</label>
          <select name="job_type" id="job_type" value={formData.job_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>
        <div>
          <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">Experience Level</label>
          <select name="experience_level" id="experience_level" value={formData.experience_level} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="entry">Entry</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="executive">Executive</option>
          </select>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="is_remote" id="is_remote" checked={formData.is_remote} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label htmlFor="is_remote" className="ml-2 block text-sm text-gray-900">Remote</label>
        </div>
        <div>
          <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Company</label>
          <select name="company_id" id="company_id" value={formData.company_id} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="application_email" className="block text-sm font-medium text-gray-700">Application Email</label>
          <input type="email" name="application_email" id="application_email" value={formData.application_email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Create Job
        </button>
      </form>
    </div>
  );
};

export default CreateJobAd;
