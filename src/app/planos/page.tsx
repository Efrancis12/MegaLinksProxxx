"use client";

import { useState } from "react";
import Navbar from "@/components/custom/navbar";
import Footer from "@/components/custom/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLANS } from "@/lib/types";
import { Check, Crown, Star, Zap } from "lucide-react";

export default function PlanosPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleCheckout(planoId: string) {
    try {
      setLoadingPlan(planoId);

      const res = await fetch("/api/pushin-create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano: planoId }),
      });

      const data = await res.json();

      if (!res.ok || !data?.paymentUrl) {
        console.error("Erro ao criar link de pagamento:", data);
        alert(data?.erro || "Erro ao gerar link de pagamento");
        return;
      }

      // Redireciona pro link da Pushin
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error("Erro no checkout:", err);
      alert("Erro inesperado ao iniciar o pagamento");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Zap className="w-4 h-4 mr-1" />
              Planos e Preços
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Escolha o Melhor Plano para Você
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Todos os planos incluem 7 dias grátis para você testar.
              Cancele quando quiser, sem compromisso!
            </p>
          </div>

          {/* Grid de Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {PLANS.map((plan) => {
              const isPremium = plan.id === "premium";
              const isDestaque = plan.id === "destaque";

              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    isPremium
                      ? "border-4 border-yellow-400 shadow-2xl scale-105"
                      : isDestaque
                      ? "border-2 border-blue-400 shadow-lg"
                      : "border-2"
                  }`}
                >
                  {isPremium && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1">
                        <Crown className="w-4 h-4 mr-1" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <div className="mb-4">
                      {isPremium && (
                        <Crown className="w-12 h-12 mx-auto text-yellow-500" />
                      )}
                      {isDestaque && (
                        <Star className="w-12 h-12 mx-auto text-blue-500" />
                      )}
                      {!isPremium && !isDestaque && (
                        <Zap className="w-12 h-12 mx-auto text-gray-500" />
                      )}
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.nome}</CardTitle>
                    <CardDescription className="text-3xl font-bold text-gray-900">
                      R$ {plan.preco.toFixed(2)}
                      <span className="text-base font-normal text-gray-600">
                        /{plan.dias} dias
                      </span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.beneficios.map((beneficio, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">
                            {beneficio}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      size="lg"
                      className={`w-full ${
                        isPremium
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                          : isDestaque
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          : "bg-gray-900 hover:bg-gray-800 text-white"
                      }`}
                      onClick={() => handleCheckout(plan.id)}
                      disabled={loadingPlan === plan.id}
                    >
                      {loadingPlan === plan.id
                        ? "Redirecionando..."
                        : `Escolher ${plan.nome}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ / Informações Adicionais */}
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Como funciona o período grátis?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Ao cadastrar seu grupo, você ganha automaticamente 7 dias de
                    divulgação gratuita. Após esse período, você pode escolher
                    um dos nossos planos para continuar.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    Posso cancelar a qualquer momento?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Sim! Não há fidelidade. Você pode cancelar quando quiser
                    através do seu painel.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    Qual a diferença entre os planos?
                  </h4>
                  <p className="text-sm text-gray-600">
                    O Plano Básico mantém seu anúncio ativo na lista geral. O
                    Plano Destaque coloca seu grupo no topo da categoria. O
                    Plano Premium garante a primeira posição em todo o site.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    Quais formas de pagamento são aceitas?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Aceitamos PIX, cartão de crédito (via Mercado Pago) e
                    PayPal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
