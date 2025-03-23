'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import { authService } from '@/services/authService';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
} 