"use client";
import { useState } from 'react';
import authService from '@/services/authService';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';

const VerifyPhonePage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await authService.verifyPhone({ otp });
      setMessage('Your phone number has been verified successfully!');
    } catch (err) {
      setError('Failed to verify phone number. The OTP may be invalid or expired.');
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
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Verify Phone Number</h2>
          <p className="text-gray-600 mb-6">
            Enter the OTP sent to your phone number.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">OTP</label>
              <input
                type="text"
                className="w-full border border-gray-400 rounded-lg p-2 mt-1 text-gray-900 placeholder-gray-400 outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
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
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyPhonePage;
