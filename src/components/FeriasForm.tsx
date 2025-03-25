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
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FeriasForm>();

  const dataInicio = watch('dataInicio');

  const validarDatas = (dataInicio: string, dataFim: string) => {
    if (!dataInicio || !dataFim) return true;
    if (new Date(dataFim) <= new Date(dataInicio)) {
      return 'A data de fim deve ser posterior à data de início';
    }
    return true;
  };

  const onSubmit = async (data: FeriasForm) => {
    try {
      await feriasService.create(data);
      router.push('/dashboard');
    } catch {
      setError('Erro ao criar solicitação de férias');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4012A1] to-[#E86E2F] bg-clip-text text-transparent">
          Nova Solicitação de Férias
        </h1>
        <p className="text-gray-600 mt-2">
          Preencha os dados para solicitar suas férias
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                <input
                  type="date"
                  {...register('dataInicio', { required: 'Data de início é obrigatória' })}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4012A1] focus:ring-[#4012A1] transition-all duration-300 p-2.5"
                  onChange={(e) => {
                    const dataInicio = e.target.value;
                    const dataFimInput = document.getElementById('dataFim') as HTMLInputElement;
                    if (dataFimInput.value) {
                      const validacao = validarDatas(dataInicio, dataFimInput.value);
                      if (validacao !== true) {
                        dataFimInput.value = '';
                      }
                    }
                    dataFimInput.min = dataInicio;
                  }}
                />
                {errors.dataInicio && (
                  <p className="text-red-500 text-sm mt-1">{errors.dataInicio.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Fim</label>
                <input
                  id="dataFim"
                  type="date"
                  {...register('dataFim', { 
                    required: 'Data de fim é obrigatória',
                    validate: (value) => validarDatas(dataInicio, value)
                  })}
                  min={dataInicio}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4012A1] focus:ring-[#4012A1] transition-all duration-300 p-2.5"
                />
                {errors.dataFim && (
                  <p className="text-red-500 text-sm mt-1">{errors.dataFim.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
              <textarea
                {...register('motivo', { required: 'Motivo é obrigatório' })}
                rows={4}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#4012A1] focus:ring-[#4012A1] transition-all duration-300 p-2.5"
                placeholder="Descreva o motivo da sua solicitação de férias..."
              />
              {errors.motivo && (
                <p className="text-red-500 text-sm mt-1">{errors.motivo.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full hover:bg-gray-200 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#4012A1] to-[#E86E2F] text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                Solicitar Férias
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 