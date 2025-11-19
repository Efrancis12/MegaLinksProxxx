"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { Send, Users, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

export default function PainelPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats] = useState({
    totalGroups: 0,
    totalViews: 0,
    totalClicks: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Meu Painel
            </h1>
            <p className="text-gray-600">
              Bem-vindo, {user.email}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Grupos Cadastrados
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalGroups}</div>
                <p className="text-xs text-muted-foreground">
                  Total de grupos ativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Visualizações
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
                <p className="text-xs text-muted-foreground">
                  Nos últimos 30 dias
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cliques
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClicks}</div>
                <p className="text-xs text-muted-foreground">
                  Total de cliques recebidos
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>
                Gerencie seus grupos e anúncios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/enviar">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Send className="w-4 h-4 mr-2" />
                  Cadastrar Novo Grupo
                </Button>
              </Link>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/grupos">
                  <Button variant="outline" className="w-full">
                    Ver Todos os Grupos
                  </Button>
                </Link>
                <Link href="/planos">
                  <Button variant="outline" className="w-full">
                    Ver Planos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Meus Grupos */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Meus Grupos</CardTitle>
              <CardDescription>
                Grupos que você cadastrou
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Você ainda não cadastrou nenhum grupo.</p>
                <Link href="/enviar">
                  <Button className="mt-4">
                    Cadastrar Primeiro Grupo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
