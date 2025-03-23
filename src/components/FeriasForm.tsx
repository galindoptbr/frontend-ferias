'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { feriasService } from '@/services/feriasService';

interface FeriasForm {
  dataInicio: string;
  dataFim: string;
  motivo: string;
}

export default function FeriasForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<FeriasForm>();

  const onSubmit = async (data: FeriasForm) => {
    try {
      await feriasService.create(data);
      router.push('/dashboard');
    } catch (err) {
      setError('Erro ao criar solicitação de férias. Tente novamente.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Nova Solicitação de Férias</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
              <input
                type="date"
                {...register('dataInicio', { required: 'Data de início é obrigatória' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
              {errors.dataInicio && (
                <p className="text-red-500 text-sm mt-1">{errors.dataInicio.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fim</label>
              <input
                type="date"
                {...register('dataFim', { required: 'Data de fim é obrigatória' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
              {errors.dataFim && (
                <p className="text-red-500 text-sm mt-1">{errors.dataFim.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
            <textarea
              {...register('motivo', { required: 'Motivo é obrigatório' })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors p-2"
              placeholder="Descreva o motivo da sua solicitação de férias..."
            />
            {errors.motivo && (
              <p className="text-red-500 text-sm mt-1">{errors.motivo.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white px-4 py-2.5 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            >
              Solicitar Férias
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 