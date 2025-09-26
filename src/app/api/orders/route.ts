import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOrderSchema } from '@/lib/orders/validation';
import { Prisma } from '@prisma/client';

// GET /api/orders?status=...  (lista)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') as
    | 'PENDING'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELED'
    | null;
  const where = status ? { status } : undefined;
  try {
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        customerName: true,
        customerPhone: true,
        status: true,
        total: true,
        paymentMethod: true,
        paymentStatus: true,
        createdAt: true,
        _count: { select: { items: true } }
      }
    });
    return NextResponse.json({ data: orders });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: 'Erro ao listar pedidos', details: msg }, { status: 500 });
  }
}

// POST /api/orders  (criar)
export async function POST(req: Request) {
  console.log('[API /api/orders] POST received');
  if (!process.env.DATABASE_URL) {
    console.error('[API /api/orders] Missing DATABASE_URL environment variable');
    return NextResponse.json({ error: 'database_url_missing', details: 'A variável de ambiente DATABASE_URL não está definida.' }, { status: 500 });
  }
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  console.log('[API /api/orders] Payload raw:', json);
  const parse = createOrderSchema.safeParse(json);
  if (!parse.success) {
    console.warn('[API /api/orders] Zod validation failed');
    return NextResponse.json({ error: 'Dados inválidos', details: parse.error.format() }, { status: 422 });
  }
  const data = parse.data;

  // Recalcular totais do lado do servidor
  const subtotal = data.items.reduce((acc, it) => acc + it.basePrice * (it.quantity || 1), 0);
  const discount = data.discount ?? 0;
  const total = subtotal - discount;

  try {
    const created = await prisma.$transaction(async (tx) => {
      console.log('[API /api/orders] Creating order in transaction');
      const order = await tx.order.create({
        data: {
          customerName: data.customerName,
          customerPhone: data.customerPhone,
            deliveryAddress: data.deliveryAddress,
          notes: data.notes,
          paymentMethod: data.paymentMethod,
          changeFor: data.changeFor ?? null,
          subtotal,
          discount,
          total,
          status: 'PENDING'
        }
      });

      // Itens
      if (data.items.length) {
        await tx.orderItem.createMany({
          data: data.items.map(it => ({
            orderId: order.id,
            productName: it.productName,
            basePrice: it.basePrice,
            quantity: it.quantity || 1,
            lineTotal: it.basePrice * (it.quantity || 1),
            category: it.category
          }))
        });
      }

      // Configurações de pizza (opcional)
      if (data.pizzaConfigs?.length) {
        await tx.pizzaConfig.createMany({
          data: data.pizzaConfigs.map(pc => ({
            orderId: order.id,
            size: pc.size,
            flavors: pc.flavors as unknown as Prisma.InputJsonValue,
            extras: (pc.extras ? (pc.extras as unknown as Prisma.InputJsonValue) : Prisma.JsonNull),
            promoApplied: pc.promoApplied ?? false,
            finalPrice: pc.finalPrice
          }))
        });
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          orderId: order.id,
          action: 'CREATE'
        }
      });

      return order;
    });

    console.log('[API /api/orders] Order created id/code:', created.id, created.code);
    return NextResponse.json({ data: { id: created.id, code: created.code } }, { status: 201 });
  } catch (e: unknown) {
    console.error('[API /api/orders] Error creating order', e);
    if (e && typeof e === 'object') {
      // Prisma initialization/connection errors
      if (e instanceof Prisma.PrismaClientInitializationError) {
        return NextResponse.json({ error: 'db_init_error', details: e.message }, { status: 500 });
      }
      // Known Prisma errors (e.g., P1001 cannot connect)
      const anyE = e as any;
      const code = anyE?.code as string | undefined;
      if (code && typeof code === 'string') {
        return NextResponse.json({ error: `prisma_${code.toLowerCase()}`, details: anyE.message }, { status: 500 });
      }
    }
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: 'Erro ao criar pedido', details: msg }, { status: 500 });
  }
}
