"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import authService from '@/services/authService';
import useAuthStore from '@/store/store';

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    const handleCallback = async () => {
      if (code) {
        try {
          const response = await authService.handleGoogleCallback({ code, state });
          localStorage.setItem('accessToken', response.access_token);
          localStorage.setItem('refreshToken', response.refresh_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
          router.push('/');
        } catch (error) {
          console.error('Google OAuth callback error:', error);
          router.push('/routes/auth/signin?error=google_oauth_failed');
        }
      }
    };

    handleCallback();
  }, [searchParams, router, setUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Authenticating with Google...</p>
    </div>
  );
};

export default GoogleCallbackPage;
