"use client";
import React, { useState } from 'react';
import propertyService from '@/services/propertyService';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/store';

const PropertyAdForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    property_type: 'rent',
    property_category: 'housing_sale',
    bedrooms: '',
    bathrooms: '',
    use_area: '',
    plot_area: '',
    year_built: '',
    address: '',
    city: '',
    postal_code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const propertyData = { ...formData, owner_id: user.id };
      const response = await propertyService.createProperty(propertyData);
      console.log('Property created:', response);
      router.push(`/routes/property/property-details/${response.id}`);
    } catch (err) {
      setError('Failed to create property ad. Please check the form and try again.');
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">Property Type</label>
        <select name="property_type" id="property_type" value={formData.property_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="purchase">Purchase</option>
          <option value="rent">Rent</option>
          <option value="sell">Sell</option>
          <option value="nutrition">Nutrition</option>
        </select>
      </div>
      <div>
        <label htmlFor="property_category" className="block text-sm font-medium text-gray-700">Property Category</label>
        <select name="property_category" id="property_category" value={formData.property_category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="plots">Plots</option>
          <option value="residence_abroad">Residence Abroad</option>
          <option value="housing_sale">Housing Sale</option>
          <option value="new_homes">New Homes</option>
          <option value="vacation_homes">Vacation Homes</option>
          <option value="leisure_plots">Leisure Plots</option>
        </select>
      </div>
      <div>
        <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
        <input type="number" name="bedrooms" id="bedrooms" value={formData.bedrooms} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
        <input type="number" name="bathrooms" id="bathrooms" value={formData.bathrooms} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="use_area" className="block text-sm font-medium text-gray-700">Use Area (sqm)</label>
        <input type="number" name="use_area" id="use_area" value={formData.use_area} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="plot_area" className="block text-sm font-medium text-gray-700">Plot Area (sqm)</label>
        <input type="number" name="plot_area" id="plot_area" value={formData.plot_area} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="year_built" className="block text-sm font-medium text-gray-700">Year Built</label>
        <input type="number" name="year_built" id="year_built" value={formData.year_built} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
        <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-top-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
        <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      <div>
        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Postal Code</label>
        <input type="text" name="postal_code" id="postal_code" value={formData.postal_code} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
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

export default PropertyAdForm;
