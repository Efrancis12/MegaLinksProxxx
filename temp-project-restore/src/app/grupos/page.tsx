"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import GroupCard from "@/components/custom/group-card";
import AgeVerificationModal from "@/components/custom/age-verification-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGroupStore } from "@/lib/store";
import { CATEGORIES, Category } from "@/lib/types";
import { isAdultCategory } from "@/lib/utils-groups";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function GruposPage() {
  const searchParams = useSearchParams();
  const { getActiveGroups } = useGroupStore();
  const [groups, setGroups] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string>("");

  useEffect(() => {
    const allGroups = getActiveGroups();
    setGroups(allGroups);
    
    // Verificar se há categoria na URL
    const categoryParam = searchParams.get("categoria");
    if (categoryParam) {
      handleCategoryChange(categoryParam);
    } else {
      setFilteredGroups(allGroups);
    }
  }, []);

  useEffect(() => {
    filterGroups();
  }, [selectedCategory, searchTerm, groups]);

  const handleCategoryChange = (category: string) => {
    if (category !== "all" && isAdultCategory(category)) {
      const verified = localStorage.getItem("age-verified");
      if (!verified) {
        setPendingCategory(category);
        setShowAgeModal(true);
        return;
      }
    }
    setSelectedCategory(category);
  };

  const handleAgeModalClose = () => {
    setShowAgeModal(false);
    if (pendingCategory) {
      setSelectedCategory(pendingCategory);
      setPendingCategory("");
    }
  };

  const filterGroups = () => {
    let filtered = groups;

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter((g) => g.categoria === selectedCategory);
    }

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter((g) =>
        g.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar: Premium > Destaque > Outros
    filtered.sort((a, b) => {
      if (a.plano === "premium" && b.plano !== "premium") return -1;
      if (a.plano !== "premium" && b.plano === "premium") return 1;
      if (a.plano === "destaque" && b.plano !== "destaque") return -1;
      if (a.plano !== "destaque" && b.plano === "destaque") return 1;
      return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
    });

    setFilteredGroups(filtered);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Todos os Grupos e Canais
            </h1>
            <p className="text-gray-600 text-lg">
              Encontre o grupo perfeito para você
            </p>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Buscar grupos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div className="md:w-64">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Categoria selecionada */}
            {selectedCategory !== "all" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtrando por:</span>
                <Badge variant="secondary">{selectedCategory}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  Limpar
                </Button>
              </div>
            )}
          </div>

          {/* Resultados */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredGroups.length} {filteredGroups.length === 1 ? "grupo encontrado" : "grupos encontrados"}
            </p>
          </div>

          {/* Grid de Grupos */}
          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Nenhum grupo encontrado</h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchTerm("");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      <AgeVerificationModal 
        isOpen={showAgeModal} 
        onClose={handleAgeModalClose}
      />
    </>
  );
}
