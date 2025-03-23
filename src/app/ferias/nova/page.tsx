'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import FeriasForm from '@/components/FeriasForm';
import { authService } from '@/services/authService';

export default function NovaSolicitacaoPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <Layout>
      <FeriasForm />
    </Layout>
  );
} 