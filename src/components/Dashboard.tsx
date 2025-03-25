"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { feriasService } from "@/services/feriasService";
import api from "@/services/api";
import Image from "next/image";
import userImage from "../../public/user.png";

interface Ferias {
  _id: string;
  dataInicio: string;
  dataFim: string;
  status: "pendente" | "aprovado" | "rejeitado";
  motivo: string;
  createdAt: string;
}

interface User {
  _id: string;
  nome: string;
  email: string;
  cargo: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [ferias, setFerias] = useState<Ferias[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    loadFerias();
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get<User[]>("/api/auth/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  const loadFerias = async () => {
    try {
      const data = await feriasService.list();
      setFerias(data);
    } catch {
      console.error("Erro ao carregar férias");
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
    <div className="max-w-7xl mx-auto px-4 pt-16">
      <div className="mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4012A1] to-[#E86E2F] bg-clip-text text-transparent">
          Minhas Solicitações de Férias
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie suas solicitações de férias
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push("/ferias/nova")}
          className="bg-gradient-to-r from-[#4012A1] to-[#E86E2F] text-white px-6 py-2 rounded-full text-sm hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
        >
          Nova Solicitação
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : ferias.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">
            Você ainda não tem solicitações de férias.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-[#4012A1] via-[#4012A1] to-[#E86E2F]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Data da Solicitação
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ferias.map((ferias) => (
                <tr key={ferias._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(ferias.dataInicio)} <br />{" "}
                    {formatDate(ferias.dataFim)}
                  </td>
                  <td className="px-6 py-4 whitespace-normal break-words max-w-xs">
                    {ferias.motivo || "Sem motivo especificado"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
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
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteLoading === ferias._id ? "Excluindo..." : "Excluir"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lista de Usuários */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4012A1] to-[#E86E2F] bg-clip-text text-transparent mb-6">
          Usuários do Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                  <Image
                    src={userImage}
                    alt="Foto do usuário"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-lg text-gray-900">
                    {user.nome}
                  </div>
                  <div className="text-sm text-gray-500">{user.cargo}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
