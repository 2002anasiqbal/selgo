"use client";
import React, { useState, useEffect } from 'react';
import carService from '@/services/carService';
import { useRouter } from 'next/navigation';

const CarAdForm = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
    color: '',
    condition: 'used',
    seller_type: 'private',
    ad_type: 'for_sale',
    category_id: '',
    features: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, featuresData] = await Promise.all([
          carService.getCategories(),
          carService.getFeatures(),
        ]);
        setCategories(categoriesData);
        setFeatures(featuresData);
      } catch (err) {
        console.error('Failed to fetch categories or features', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;
    const featureId = parseInt(value, 10);
    setFormData((prev) => {
      if (checked) {
        return { ...prev, features: [...prev.features, featureId] };
      } else {
        return { ...prev, features: prev.features.filter((id) => id !== featureId) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await carService.createCar(formData);
      console.log('Car created:', response);
      router.push(`/routes/cars/${response.id}`);
    } catch (err) {
      setError('Failed to create car ad. Please check the form and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields for car details */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="make" className="block text-sm font-medium text-gray-700">Make</label>
        <input type="text" name="make" id="make" value={formData.make} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
        <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
        <input type="number" name="year" id="year" value={formData.year} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Mileage</label>
        <input type="number" name="mileage" id="mileage" value={formData.mileage} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700">Fuel Type</label>
        <input type="text" name="fuel_type" id="fuel_type" value={formData.fuel_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">Transmission</label>
        <input type="text" name="transmission" id="transmission" value={formData.transmission} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
        <input type="text" name="color" id="color" value={formData.color} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
        <select name="condition" id="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="certified_pre_owned">Certified Pre-Owned</option>
        </select>
      </div>
      <div>
        <label htmlFor="seller_type" className="block text-sm font-medium text-gray-700">Seller Type</label>
        <select name="seller_type" id="seller_type" value={formData.seller_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="private">Private</option>
          <option value="dealer">Dealer</option>
        </select>
      </div>
      <div>
        <label htmlFor="ad_type" className="block text-sm font-medium text-gray-700">Ad Type</label>
        <select name="ad_type" id="ad_type" value={formData.ad_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="for_sale">For Sale</option>
          <option value="wanted">Wanted</option>
          <option value="auction">Auction</option>
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
        <label className="block text-sm font-medium text-gray-700">Features</label>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map(feature => (
            <div key={feature.id} className="flex items-center">
              <input
                id={`feature-${feature.id}`}
                name="features"
                type="checkbox"
                value={feature.id}
                checked={formData.features.includes(feature.id)}
                onChange={handleFeatureChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`feature-${feature.id}`} className="ml-2 block text-sm text-gray-900">
                {feature.name}
              </label>
            </div>
          ))}
        </div>
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

export default CarAdForm;
