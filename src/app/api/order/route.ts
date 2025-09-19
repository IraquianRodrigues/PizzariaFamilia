import { NextResponse } from 'next/server';

// Rota para receber pedidos e opcionalmente notificar via WhatsApp Cloud API.
// Configure no .env.local:
// WHATSAPP_TOKEN=EA... (token de acesso permanente/renovável)
// WHATSAPP_PHONE_ID=123456789012345
// WHATSAPP_NOTIFY_NUMBER=5532999999999 (E.164, sem + opcional)

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  totalPrice?: number;
}

interface OrderPayload {
  customerName: string;
  customerPhone: string;
  address: string;
  neighborhood?: string;
  deliveryFee?: number;
  referencePoint?: string;
  total: number;
  items: OrderItem[];
  message: string; // mensagem formatada usada também para WhatsApp
  paymentMethod?: string;
  changeNeeded?: boolean;
  changeFor?: string;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as OrderPayload;

    // Log simples no server (poderia salvar em DB futuramente)
    console.log('[NEW_ORDER]', {
      when: new Date().toISOString(),
      name: data.customerName,
      phone: data.customerPhone,
      neighborhood: data.neighborhood,
      deliveryFee: data.deliveryFee,
      total: data.total,
      items: data.items.length,
      payment: data.paymentMethod,
      changeNeeded: data.changeNeeded,
      changeFor: data.changeFor,
    });

    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID; // PHONE_NUMBER_ID
    const notify = process.env.WHATSAPP_NOTIFY_NUMBER; // Número do estabelecimento (destino)

    if (token && phoneId && notify) {
      // Construir corpo da mensagem (texto simples). Para outras mídias usar formatos do Cloud API.
      const body = data.message || `Novo pedido de ${data.customerName} - Total R$ ${data.total.toFixed(2)}`;

      const resp = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: notify.startsWith('+') ? notify.substring(1) : notify,
          type: 'text',
          text: { body },
        }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error('[WHATSAPP_API_ERROR]', txt);
        return NextResponse.json({ ok: false, error: 'whatsapp_failed' }, { status: 502 });
      }
    } else {
      // Sem credenciais -> apenas responder OK (modo desenvolvimento)
      console.warn('[WHATSAPP_DISABLED] Token/PhoneId ausente, notificação não enviada.');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[ORDER_POST_ERROR]', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
