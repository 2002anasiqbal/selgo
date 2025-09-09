"use client";
import React, { useState } from 'react';
import authService from '@/services/authService';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await authService.forgotPassword({ email });
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      setError('Failed to send password reset email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen relative">
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="/assets/signin/1-shop-with-us.png"
          alt="Shop with us"
          className="w-full h-full object-cover"
        />
        <Link href="/routes/auth/signin">
          <button className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition">
            <FaChevronLeft className="text-black text-lg" />
          </button>
        </Link>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="max-w-sm w-full px-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Forgot Password</h2>
          <p className="text-gray-600 mb-6">
            Enter your email address and we will send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email address</label>
              <input
                type="email"
                className="w-full border border-gray-400 rounded-lg p-2 mt-1 text-gray-900 placeholder-gray-400 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            {message && <p className="text-green-500 text-sm mb-3">{message}</p>}
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              type="submit"
              className="w-full bg-teal-400 text-white py-2 rounded-lg mt-4 hover:bg-teal-500 transition"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
