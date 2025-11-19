"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGroupStore } from "@/lib/store";
import { Group } from "@/lib/types";
import { formatDate } from "@/lib/utils-groups";
import { ExternalLink, Calendar, AlertCircle, Crown, Star, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GrupoPage() {
  const params = useParams();
  const router = useRouter();
  const { getGroupById, updateGroup } = useGroupStore();
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    const id = params.id as string;
    const foundGroup = getGroupById(id);
    
    if (foundGroup) {
      setGroup(foundGroup);
      // Incrementar visualizações
      updateGroup(id, {
        visualizacoes: (foundGroup.visualizacoes || 0) + 1
      });
    }
  }, [params.id]);

  if (!group) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold mb-4">Grupo não encontrado</h1>
            <Link href="/grupos">
              <Button>Ver Todos os Grupos</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isPremium = group.plano === "premium";
  const isDestaque = group.plano === "destaque";
  const isExpired = group.status === "expirado";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botão Voltar */}
          <Link href="/grupos">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para grupos
            </Button>
          </Link>

          {/* Card Principal */}
          <Card className={`border-2 ${
            isPremium ? "border-yellow-400 shadow-2xl" : 
            isDestaque ? "border-blue-400 shadow-lg" : ""
          }`}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <CardTitle className="text-2xl sm:text-3xl">
                      {group.nome}
                    </CardTitle>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shrink-0">
                        <Crown className="w-4 h-4 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {isDestaque && !isPremium && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shrink-0">
                        <Star className="w-4 h-4 mr-1" />
                        Destaque
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex flex-wrap items-center gap-2 text-base">
                    <Badge variant="outline" className="text-sm">
                      {group.categoria}
                    </Badge>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {group.visualizacoes || 0} visualizações
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Status de Expiração */}
              {isExpired ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900 mb-1">Anúncio Expirado</p>
                    <p className="text-sm text-red-700">
                      Este anúncio expirou. Entre em contato com o dono para renovação.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-green-900 mb-1">Anúncio Ativo</p>
                    <p className="text-sm text-green-700">
                      Expira em: {formatDate(group.dataExpiracao)}
                    </p>
                  </div>
                </div>
              )}

              {/* Descrição */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Sobre o Grupo/Canal</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {group.descricao}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <a 
                  href={group.linkTelegram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Entrar no Telegram
                  </Button>
                </a>
                
                {isExpired && (
                  <Link href="/planos" className="flex-1">
                    <Button size="lg" variant="outline" className="w-full">
                      Renovar Anúncio
                    </Button>
                  </Link>
                )}
              </div>

              {/* Informações Adicionais */}
              <div className="border-t pt-6 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Cadastrado em:</span>
                  <span className="font-medium">{formatDate(group.dataCriacao)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={isExpired ? "destructive" : "default"}>
                    {group.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA para Cadastrar */}
          {!isExpired && (
            <Card className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="py-8 text-center space-y-4">
                <h3 className="text-2xl font-bold">
                  Quer divulgar seu grupo também?
                </h3>
                <p className="text-white/90">
                  Cadastre gratuitamente e ganhe 7 dias de divulgação!
                </p>
                <Link href="/enviar">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Cadastrar Meu Grupo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
