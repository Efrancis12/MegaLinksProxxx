"use client";

import { Group } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, ExternalLink, Crown, Star } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils-groups";

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const isPremium = group.plano === "premium";
  const isDestaque = group.plano === "destaque";

  return (
    <Card className={`h-full flex flex-col transition-all duration-300 hover:shadow-xl ${
      isPremium ? "border-2 border-yellow-400 shadow-lg" : 
      isDestaque ? "border-2 border-blue-400" : ""
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg sm:text-xl line-clamp-2">
            {group.nome}
          </CardTitle>
          {isPremium && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shrink-0">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          {isDestaque && !isPremium && (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shrink-0">
              <Star className="w-3 h-3 mr-1" />
              Destaque
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-2 text-sm">
          <Badge variant="outline">{group.categoria}</Badge>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-sm text-gray-600 line-clamp-3">
          {group.descricao}
        </p>
        
        <div className="mt-4 space-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Expira em: {formatDate(group.dataExpiracao)}</span>
          </div>
          {group.visualizacoes && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{group.visualizacoes} visualizações</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Link href={`/grupo/${group.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Ver Detalhes
          </Button>
        </Link>
        <a 
          href={group.linkTelegram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Entrar
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
