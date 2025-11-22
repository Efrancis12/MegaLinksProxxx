import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Mapeamento dos planos para links fixos da Pushin (NOVOS LINKS)
const PLAN_LINKS: Record<string, string> = {
  // nomes usados na URL (?plano=basico|destaque|premium)
  basico:   'https://app.pushinpay.com.br/service/pay/A05FF614-C67F-4744-B3DD-F2AB45BB3E5B',
  destaque: 'https://app.pushinpay.com.br/service/pay/A061104D-031A-4B51-B08C-FDE6638E5127',
  premium:  'https://app.pushinpay.com.br/service/pay/A06111EE-929A-4345-9813-26E9CCF10FA9',

  // aliases, caso em algum lugar você use mlp_29, mlp_49, mlp_99
  mlp_29: 'https://app.pushinpay.com.br/service/pay/A05FF614-C67F-4744-B3DD-F2AB45BB3E5B',
  mlp_49: 'https://app.pushinpay.com.br/service/pay/A061104D-031A-4B51-B08C-FDE6638E5127',
  mlp_99: 'https://app.pushinpay.com.br/service/pay/A06111EE-929A-4345-9813-26E9CCF10FA9',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plano, userId } = body as { plano: string; userId?: string };

    if (!plano) {
      return NextResponse.json(
        { ok: false, error: 'Plano não enviado' },
        { status: 400 }
      );
    }

    const paymentUrl = PLAN_LINKS[plano];

    if (!paymentUrl) {
      return NextResponse.json(
        { ok: false, error: `Plano inválido: ${plano}` },
        { status: 400 }
      );
    }

    // Se tiver userId, salva no Supabase. Se não tiver, só segue sem quebrar.
    if (userId) {
      const { error: insertError } = await supabaseAdmin
        .from('user_plans')
        .insert({
          user_id: userId,
          plan_slug: plano,   // 'basico', 'destaque', 'premium'
          checkout_id: null,
          status: 'pending',
          amount: null,
        });

      if (insertError) {
        console.error('Erro ao inserir no Supabase:', insertError);
      }
    } else {
      console.warn('userId não enviado, pulando insert em user_plans');
    }

    return NextResponse.json({
      ok: true,
      paymentUrl,
    });
  } catch (err) {
    console.error('Erro em /api/pushin-create-checkout:', err);
    return NextResponse.json(
      { ok: false, error: 'Erro interno ao criar link' },
      { status: 500 }
    );
  }
}
