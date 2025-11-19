"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import GroupCard from "@/components/custom/group-card";
import AgeVerificationModal from "@/components/custom/age-verification-modal";
import { useGroupStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";
import { isAdultCategory } from "@/lib/utils-groups";
import { Send, TrendingUp, Clock, Shield, Zap, Users } from "lucide-react";

export default function Home() {
  const { getFeaturedGroups, getRecentGroups } = useGroupStore();
  const [featuredGroups, setFeaturedGroups] = useState<any[]>([]);
  const [recentGroups, setRecentGroups] = useState<any[]>([]);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    setFeaturedGroups(getFeaturedGroups());
    setRecentGroups(getRecentGroups());
  }, []);

  const handleCategoryClick = (category: string) => {
    if (isAdultCategory(category)) {
      const verified = localStorage.getItem("age-verified");
      if (!verified) {
        setSelectedCategory(category);
        setShowAgeModal(true);
        return;
      }
    }
    window.location.href = `/grupos?categoria=${encodeURIComponent(category)}`;
  };

  const handleAgeModalClose = () => {
    setShowAgeModal(false);
    if (selectedCategory) {
      window.location.href = `/grupos?categoria=${encodeURIComponent(selectedCategory)}`;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                <Zap className="w-4 h-4" />
                <span>7 dias grátis para testar!</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Divulgue seu grupo ou canal do Telegram no MegaLinksPro!
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
                Ganhe mais membros com facilidade — 7 dias grátis para testar!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link href="/enviar">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                    <Send className="w-5 h-5 mr-2" />
                    Cadastrar Meu Grupo
                  </Button>
                </Link>
                <Link href="/grupos">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/20 hover:bg-white/30 text-lg px-8 py-6">
                    Ver Todos os Grupos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">Mais Membros</h3>
                <p className="text-sm text-gray-600">
                  Alcance milhares de pessoas interessadas no seu conteúdo
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">7 Dias Grátis</h3>
                <p className="text-sm text-gray-600">
                  Teste nossa plataforma sem compromisso por uma semana
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">100% Seguro</h3>
                <p className="text-sm text-gray-600">
                  Plataforma confiável e verificada para divulgação
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Categorias */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Explore por Categoria
            </h2>
            <p className="text-gray-600 text-lg">
              Encontre grupos e canais do seu interesse
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-center group"
              >
                <div className="font-semibold text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                  {category}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Grupos em Destaque */}
        {featuredGroups.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <Users className="w-4 h-4 mr-1" />
                Destaques
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Grupos em Destaque
              </h2>
              <p className="text-gray-600 text-lg">
                Os melhores grupos e canais do momento
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          </section>
        )}

        {/* Grupos Recentes */}
        {recentGroups.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Clock className="w-4 h-4 mr-1" />
                Novos
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Grupos Mais Recentes
              </h2>
              <p className="text-gray-600 text-lg">
                Descubra os últimos grupos cadastrados
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/grupos">
                <Button size="lg" variant="outline" className="border-2">
                  Ver Todos os Grupos
                </Button>
              </Link>
            </div>
          </section>
        )}

        {/* CTA Final */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Pronto para Crescer?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Cadastre seu grupo agora e comece a receber novos membros hoje mesmo!
              </p>
              <Link href="/enviar">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  <Send className="w-5 h-5 mr-2" />
                  Cadastrar Gratuitamente
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
      
      <AgeVerificationModal 
        isOpen={showAgeModal} 
        onClose={handleAgeModalClose}
      />
    </>
  );
}
