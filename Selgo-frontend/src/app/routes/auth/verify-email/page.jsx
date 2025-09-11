"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import authService from '@/services/authService';
import Link from 'next/link';

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      const verify = async () => {
        try {
          await authService.verifyEmail(token);
          setMessage('Your email has been verified successfully! You can now log in.');
        } catch (err) {
          setError('Failed to verify email. The link may be invalid or expired.');
        }
      };
      verify();
    } else {
      setError('No verification token found.');
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-red-500 text-lg">{error}</p>
            <Link href="/routes/auth/signin" className="text-blue-600 hover:underline mt-4 inline-block">
              Go to login
            </Link>
          </>
        ) : (
          <p className="text-green-500 text-lg">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
