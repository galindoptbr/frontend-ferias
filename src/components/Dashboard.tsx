"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { feriasService } from "@/services/feriasService";

interface Ferias {
  _id: string;
  dataInicio: string;
  dataFim: string;
  status: "pendente" | "aprovado" | "rejeitado";
  motivo: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [ferias, setFerias] = useState<Ferias[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    loadFerias();
  }, []);

  const loadFerias = async () => {
    try {
      const data = await feriasService.list();
      setFerias(data);
    } catch (error) {
      console.error("Erro ao carregar férias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm("Tem certeza que deseja excluir esta solicitação de férias?")
    ) {
      return;
    }

    try {
      setDeleteLoading(id);
      await feriasService.delete(id);
      setFerias(ferias.filter((f) => f._id !== id));
    } catch (error) {
      alert("Erro ao excluir solicitação de férias. Tente novamente.");
    } finally {
      setDeleteLoading(null);
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

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Solicitações de Férias</h1>
        <button
          onClick={() => router.push("/ferias/nova")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Nova Solicitação
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : ferias.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Você ainda não tem solicitações de férias.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
              {ferias.map((ferias) => (
                <tr key={ferias._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(ferias.dataInicio)} <br />{" "}
                    {formatDate(ferias.dataFim)}
                  </td>
                  <td className="px-6 py-4">{ferias.motivo}</td>
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
                    {ferias.status === "pendente" && (
                      <button
                        onClick={() => handleDelete(ferias._id)}
                        disabled={deleteLoading === ferias._id}
                        className="text-red-600 hover:text-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md px-2 py-1 text-sm cursor-pointer"
                      >
                        {deleteLoading === ferias._id
                          ? "Excluindo..."
                          : "Excluir"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
