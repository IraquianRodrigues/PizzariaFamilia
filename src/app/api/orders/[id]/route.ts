import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateStatusSchema } from '@/lib/orders/validation';

interface Params { params: { id: string } }

// GET /api/orders/:id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true,
        configs: true,
        auditLogs: { orderBy: { createdAt: 'asc' } }
      }
    });
    if (!order) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    return NextResponse.json({ data: order });
  } catch (e:any) {
    return NextResponse.json({ error: 'Erro ao buscar pedido', details: e.message }, { status: 500 });
  }
}

// PATCH /api/orders/:id (atualizar status)
export async function PATCH(req: NextRequest, { params }: Params) {
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  const parsed = updateStatusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', issues: parsed.error.format() }, { status: 422 });
  }
  try {
    const existing = await prisma.order.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    const updated = await prisma.$transaction(async (tx) => {
      const up = await tx.order.update({ where: { id: params.id }, data: { status: parsed.data.status } });
      await tx.auditLog.create({
        data: {
          orderId: params.id,
          action: 'STATUS_CHANGE',
          oldStatus: existing.status,
          newStatus: parsed.data.status
        }
      });
      return up;
    });
    return NextResponse.json({ data: { id: updated.id, status: updated.status } });
  } catch (e:any) {
    return NextResponse.json({ error: 'Erro ao atualizar status', details: e.message }, { status: 500 });
  }
}
