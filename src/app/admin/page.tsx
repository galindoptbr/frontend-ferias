"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import AdminDashboard from "@/components/AdminDashboard";
import UserManagement from "@/components/UserManagement";
import { authService } from "@/services/authService";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Verificar se o usuário é admin
    const user = authService.getCurrentUser();
    if (!user?.isAdmin) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <Layout>
      <div className="space-y-8 mt-10">
        <div>
          <AdminDashboard />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <UserManagement />
        </div>
      </div>
    </Layout>
  );
}
