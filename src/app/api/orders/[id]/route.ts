import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateStatusSchema } from '@/lib/orders/validation';

// GET /api/orders/:id
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        configs: true,
        auditLogs: { orderBy: { createdAt: 'asc' } }
      }
    });
    if (!order) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    return NextResponse.json({ data: order });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: 'Erro ao buscar pedido', details: msg }, { status: 500 });
  }
}

// PATCH /api/orders/:id (atualizar status)
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  const parsed = updateStatusSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', issues: parsed.error.format() }, { status: 422 });
  }
  try {
    const { id } = await ctx.params;
    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });

    const { status, paymentStatus } = parsed.data;
    const updated = await prisma.$transaction(async (tx) => {
      const up = await tx.order.update({ where: { id }, data: {
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {})
      } });

      if (status) {
        await tx.auditLog.create({
          data: {
            orderId: id,
            action: 'STATUS_CHANGE',
            oldStatus: existing.status,
            newStatus: status
          }
        });
      }
      if (paymentStatus && paymentStatus !== existing.paymentStatus) {
        await tx.auditLog.create({
          data: {
            orderId: id,
            action: 'PAYMENT_STATUS_CHANGE',
            metadata: { old: existing.paymentStatus, new: paymentStatus }
          }
        });
      }
      return up;
    });
    return NextResponse.json({ data: { id: updated.id, status: updated.status, paymentStatus: updated.paymentStatus } });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: 'Erro ao atualizar', details: msg }, { status: 500 });
  }
}
