"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import squareService from "@/services/squareService";
import useAuthStore from "@/store/store";

const SquareForm = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    condition: "used",
    seller_type: "private",
    ad_type: "for_sale",
    location_name: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await squareService.getCategories();
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setFormData(prev => ({ ...prev, category_id: fetchedCategories[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }
    setImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to post an ad.");
      router.push("/routes/auth/signin");
      return;
    }
    setLoading(true);

    try {
      const uploadedImageUrls = [];
      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);
        const response = await squareService.uploadImage(formData);
        uploadedImageUrls.push({ image_url: response.url, is_primary: uploadedImageUrls.length === 0 });
      }

      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        images: uploadedImageUrls,
        user_id: user.id,
      };

      const result = await squareService.createItem(itemData);
      alert("Ad created successfully!");
      router.push(`/routes/square`); // Redirect to the main square page

    } catch (error) {
      console.error("Failed to create ad:", error);
      alert("Failed to create ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white";
  const selectStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white";
  const textareaStyles = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black bg-white";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Create a new Ad</h1>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className={inputStyles} required />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} className={textareaStyles} rows="4"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (NOK)</label>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} className={inputStyles} required />
          </div>
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category_id" id="category_id" value={formData.category_id} onChange={handleInputChange} className={selectStyles} required>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Condition</label>
          <div className="flex space-x-4">
            <label><input type="radio" name="condition" value="new" checked={formData.condition === 'new'} onChange={handleInputChange} /> New</label>
            <label><input type="radio" name="condition" value="used" checked={formData.condition === 'used'} onChange={handleInputChange} /> Used</label>
            <label><input type="radio" name="condition" value="for_parts" checked={formData.condition === 'for_parts'} onChange={handleInputChange} /> For Parts</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location_name" id="location_name" value={formData.location_name} onChange={handleInputChange} className={inputStyles} placeholder="e.g., Oslo, Norway" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {imagePreviews.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index}`} className="w-full h-20 object-cover rounded" />
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Creating Ad..." : "Create Ad"}
        </button>
      </form>
    </div>
  );
};

export default SquareForm;
