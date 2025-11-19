import { Group } from "./types";

// Função para calcular data de expiração
export function calculateExpirationDate(startDate: Date, days: number): Date {
  const expiration = new Date(startDate);
  expiration.setDate(expiration.getDate() + days);
  return expiration;
}

// Função para verificar se um grupo expirou
export function isExpired(expirationDate: string): boolean {
  return new Date(expirationDate) < new Date();
}

// Função para formatar data
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR");
}

// Função para gerar ID único
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Função para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para validar link do Telegram
export function isValidTelegramLink(link: string): boolean {
  const telegramRegex = /^(https?:\/\/)?(t\.me|telegram\.me)\/.+$/;
  return telegramRegex.test(link);
}

// Função para verificar se categoria é +18
export function isAdultCategory(category: string): boolean {
  return category.toLowerCase().includes("+18") || category.toLowerCase().includes("adulto");
}

// Função para enviar email (simulação - integrar com serviço real)
export async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  console.log("📧 Email enviado para:", to);
  console.log("Assunto:", subject);
  console.log("Corpo:", body);
  
  // Aqui você integraria com um serviço real como SendGrid, Resend, etc.
  // Por enquanto, apenas simula o envio
  return true;
}

// Função para enviar email de expiração
export async function sendExpirationEmail(group: Group): Promise<boolean> {
  const subject = "Seu anúncio no MegaLinksPro expirou";
  const body = `
    Olá!
    
    Seu anúncio "${group.nome}" no MegaLinksPro expirou.
    
    Para renovar e continuar recebendo novos membros, clique no link abaixo:
    ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/painel
    
    Atenciosamente,
    Equipe MegaLinksPro
  `;
  
  return sendEmail(group.emailDono, subject, body);
}

// Função para enviar email de confirmação de pagamento
export async function sendPaymentConfirmationEmail(group: Group, planName: string): Promise<boolean> {
  const subject = "Pagamento confirmado - MegaLinksPro";
  const body = `
    Olá!
    
    Seu pagamento do ${planName} foi confirmado com sucesso!
    
    Seu anúncio "${group.nome}" está ativo por mais 30 dias.
    
    Obrigado por escolher o MegaLinksPro!
    
    Atenciosamente,
    Equipe MegaLinksPro
  `;
  
  return sendEmail(group.emailDono, subject, body);
}

// Função para processar grupos expirados (executar periodicamente)
export function processExpiredGroups(groups: Group[]): Group[] {
  return groups.map((group) => {
    if (group.status === "ativo" && isExpired(group.dataExpiracao)) {
      // Enviar email de expiração
      sendExpirationEmail(group);
      
      return {
        ...group,
        status: "expirado" as const
      };
    }
    return group;
  });
}
