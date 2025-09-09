"use client";
import React, { useState, useEffect } from 'react';
import squareService from '@/services/squareService';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/store';

const SquareAdForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    condition: 'used',
    seller_type: 'private',
    ad_type: 'for_sale',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await squareService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const itemData = { ...formData, user_id: user.id };
      const response = await squareService.createItem(itemData);
      console.log('Item created:', response);
      router.push(`/routes/square/${response.id}`);
    } catch (err) {
      setError('Failed to create square ad. Please check the form and try again.');
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
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
        <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="">Select a category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
        <select name="condition" id="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
      </div>
      <div>
        <label htmlFor="seller_type" className="block text-sm font-medium text-gray-700">Seller Type</label>
        <select name="seller_type" id="seller_type" value={formData.seller_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="private">Private</option>
          <option value="business">Business</option>
        </select>
      </div>
      <div>
        <label htmlFor="ad_type" className="block text-sm font-medium text-gray-700">Ad Type</label>
        <select name="ad_type" id="ad_type" value={formData.ad_type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="for_sale">For Sale</option>
          <option value="wanted">Wanted</option>
          <option value="giveaway">Giveaway</option>
        </select>
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

export default SquareAdForm;
