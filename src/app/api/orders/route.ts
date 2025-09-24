import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOrderSchema } from '@/lib/orders/validation';

// GET /api/orders?status=...  (lista)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') as any | null;
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
  } catch (e:any) {
    return NextResponse.json({ error: 'Erro ao listar pedidos', details: e.message }, { status: 500 });
  }
}

// POST /api/orders  (criar)
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  const parse = createOrderSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: 'Dados inválidos', issues: parse.error.format() }, { status: 422 });
  }
  const data = parse.data;

  // Recalcular totais do lado do servidor
  const subtotal = data.items.reduce((acc, it) => acc + it.basePrice * (it.quantity || 1), 0);
  const discount = data.discount ?? 0;
  const total = subtotal - discount;

  try {
    const created = await prisma.$transaction(async (tx) => {
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
            flavors: pc.flavors as any,
            extras: pc.extras as any,
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

    return NextResponse.json({ data: { id: created.id, code: created.code } }, { status: 201 });
  } catch (e:any) {
    return NextResponse.json({ error: 'Erro ao criar pedido', details: e.message }, { status: 500 });
  }
}
