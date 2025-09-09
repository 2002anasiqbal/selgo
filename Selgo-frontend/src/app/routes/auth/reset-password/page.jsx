"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import authService from '@/services/authService';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (resetToken) {
      setToken(resetToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await authService.resetPassword({ token, new_password: newPassword });
      setMessage('Your password has been reset successfully. You can now log in with your new password.');
      setTimeout(() => router.push('/routes/auth/signin'), 3000);
    } catch (err) {
      setError('Failed to reset password. The link may be invalid or expired.');
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
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full border border-gray-400 rounded-lg p-2 mt-1 text-gray-900 placeholder-gray-400 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm New Password</label>
              <input
                type="password"
                className="w-full border border-gray-400 rounded-lg p-2 mt-1 text-gray-900 placeholder-gray-400 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
