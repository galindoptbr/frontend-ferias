"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/authService";
import api from "@/services/api";

interface User {
  _id: string;
  nome: string;
  email: string;
  cargo: string;
  isAdmin: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get<User[]>("/api/auth/users");
      setUsers(response.data.filter((user) => !user.isAdmin)); // Mostra apenas usuários não-admin
    } catch (err: any) {
      setError("Erro ao carregar usuários");
      console.error("Erro ao carregar usuários:", err);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      setError("");
      setSuccess("");
      await authService.promoteToAdmin(userId);
      setSuccess("Usuário promovido a administrador com sucesso!");
      loadUsers();
    } catch (err: any) {
      setError(err.message || "Erro ao promover usuário");
    }
  };

  if (users.length === 0) {
    return null; // Não mostra nada se não houver usuários para promover
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user._id} className="bg-white p-4 rounded-lg shadow">
            <div className="font-medium">{user.nome}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
            <div className="text-sm text-gray-500 mb-3">{user.cargo}</div>
            <button
              onClick={() => handlePromoteToAdmin(user._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 cursor-pointer"
            >
              Promover a Admin
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
