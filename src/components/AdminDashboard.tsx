"use client";

import { useEffect, useState } from "react";
import { feriasService } from "@/services/feriasService";
import axios from "axios";

interface Ferias {
  _id: string;
  funcionario: {
    _id: string;
    nome: string;
    email: string;
    cargo: string;
  };
  dataInicio: string;
  dataFim: string;
  status: "pendente" | "aprovado" | "rejeitado";
  motivo: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [ferias, setFerias] = useState<Ferias[]>([]);
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFerias();
  }, []);

  const loadFerias = async () => {
    try {
      setError(null);
      const data = await feriasService.listAll();
      console.log("Dados recebidos da API:", data); // Log para debug
      setFerias(data);
    } catch (err) {
      console.error("Erro ao carregar férias:", err);
      if (axios.isAxiosError(err)) {
        setError(
          "Erro ao carregar as solicitações de férias. Por favor, tente novamente."
        );
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    novoStatus: "aprovado" | "rejeitado"
  ) => {
    setAtualizando(true);
    try {
      await feriasService.updateStatus(id, novoStatus);
      await loadFerias();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      if (axios.isAxiosError(err)) {
        setError("Erro ao atualizar o status. Por favor, tente novamente.");
      } else {
        setError("Ocorreu um erro inesperado ao atualizar o status.");
      }
    } finally {
      setAtualizando(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "bg-green-100 text-green-800";
      case "rejeitado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Férias</h1>
        <p className="text-gray-600">
          Gerencie todas as solicitações de férias dos funcionários
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : ferias.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Não há solicitações de férias.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funcionário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data da Solicitação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ferias.map((ferias) => {
                console.log("Renderizando férias:", ferias); // Log para debug
                return (
                  <tr key={ferias._id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {ferias.funcionario.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ferias.funcionario.cargo}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(ferias.dataInicio)} <br />{" "}
                      {formatDate(ferias.dataFim)}
                    </td>
                    <td className="px-6 py-4 whitespace-normal break-words max-w-xs">
                      {ferias.motivo || "Sem motivo especificado"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          ferias.status
                        )}`}
                      >
                        {ferias.status.charAt(0).toUpperCase() +
                          ferias.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(ferias.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ferias.status === "pendente" && !atualizando && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateStatus(ferias._id, "aprovado")
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors cursor-pointer"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(ferias._id, "rejeitado")
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            Rejeitar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
