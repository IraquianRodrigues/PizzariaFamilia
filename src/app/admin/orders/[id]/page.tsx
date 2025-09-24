"use client";
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r=>r.json());

const statusOptions = ['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELED'] as const;
const paymentOptions = ['UNPAID','PAID','REFUNDED','PARTIAL'] as const;

const statusLabels: Record<string,string> = {
  PENDING: 'Pendente', CONFIRMED: 'Confirmado', PREPARING: 'Preparando', OUT_FOR_DELIVERY: 'Saiu', DELIVERED: 'Entregue', CANCELED: 'Cancelado'
};

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, mutate, isLoading } = useSWR<{ data: any }>(`/api/orders/${id}`, fetcher, { refreshInterval: 8000 });
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const order = data?.data;

  async function update(payload: any) {
    setUpdating(true);
    await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
    mutate();
    setUpdating(false);
  }

  if (isLoading) return <div className="p-6">Carregando...</div>;
  if (!order) return <div className="p-6">Pedido não encontrado.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedido #{order.code}</h1>
        <button onClick={()=>router.push('/admin/orders')} className="text-sm px-3 py-1 border rounded bg-white hover:bg-gray-50">Voltar</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded border bg-white space-y-2">
          <h2 className="font-semibold text-sm">Cliente</h2>
          <p className="text-sm font-medium">{order.customerName}</p>
          <p className="text-xs text-gray-600">{order.customerPhone}</p>
          {order.deliveryAddress && <p className="text-xs text-gray-600">Endereço: {order.deliveryAddress}</p>}
          {order.notes && <p className="text-xs text-gray-600">Obs: {order.notes}</p>}
          <p className="text-xs text-gray-500">Criado: {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</p>
        </div>
        <div className="p-4 rounded border bg-white space-y-3">
          <h2 className="font-semibold text-sm">Status</h2>
          <select disabled={updating} value={order.status} onChange={e=>update({ status: e.target.value })} className="w-full border rounded px-2 py-1 text-sm">
            {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
          <h2 className="font-semibold text-sm">Pagamento</h2>
          <select disabled={updating} value={order.paymentStatus} onChange={e=>update({ paymentStatus: e.target.value })} className="w-full border rounded px-2 py-1 text-sm">
            {paymentOptions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <p className="text-xs text-gray-600">Método: {order.paymentMethod}</p>
          {order.changeFor && <p className="text-xs text-gray-600">Troco para: R$ {order.changeFor.toFixed(2)}</p>}
          <div className="text-sm font-semibold text-green-600">Total: R$ {order.total.toFixed(2)}</div>
        </div>
        <div className="p-4 rounded border bg-white space-y-2">
          <h2 className="font-semibold text-sm">Resumo</h2>
          <p className="text-xs">Subtotal: R$ {order.subtotal.toFixed(2)}</p>
          <p className="text-xs">Desconto: R$ {order.discount.toFixed(2)}</p>
          <p className="text-xs font-medium text-green-700">Total: R$ {order.total.toFixed(2)}</p>
          <p className="text-[11px] text-gray-500">Configs de pizza listadas abaixo.</p>
        </div>
      </div>

      <div className="p-4 rounded border bg-white">
        <h2 className="font-semibold text-sm mb-2">Itens ({order.items.length})</h2>
        <ul className="divide-y text-sm">
          {order.items.map((it: any) => (
            <li key={it.id} className="py-2 flex items-center justify-between">
              <div>
                <p className="font-medium">{it.productName} {it.category && <span className="text-[10px] text-gray-500">[{it.category}]</span>}</p>
                <p className="text-[11px] text-gray-500">Qtd: {it.quantity} • Unit: R$ {it.basePrice.toFixed(2)}</p>
              </div>
              <span className="font-semibold">R$ {(it.lineTotal).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      {order.configs.length > 0 && (
        <div className="p-4 rounded border bg-white">
          <h2 className="font-semibold text-sm mb-2">Configurações de Pizza ({order.configs.length})</h2>
          <ul className="divide-y text-sm">
            {order.configs.map((cfg: any) => (
              <li key={cfg.id} className="py-2">
                <p className="font-medium">Tamanho: {cfg.size} {cfg.promoApplied && <span className="text-[10px] text-green-600">(Promo)</span>}</p>
                <p className="text-[11px] text-gray-500">Sabores: {cfg.flavors.join(', ')}</p>
                {cfg.extras?.length && <p className="text-[11px] text-gray-500">Extras: {cfg.extras.map((e:any)=>e.id).join(', ')}</p>}
                <p className="text-[11px] text-gray-600">Preço Config: R$ {cfg.finalPrice.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-4 rounded border bg-white">
        <h2 className="font-semibold text-sm mb-2">Histórico</h2>
        <ul className="text-xs space-y-1">
          {order.auditLogs.map((log: any) => (
            <li key={log.id} className="flex gap-2">
              <span className="text-gray-500 font-mono">{format(new Date(log.createdAt), 'HH:mm')}</span>
              <span>
                {log.action === 'STATUS_CHANGE' && (
                  <>Status: {log.oldStatus} ➜ {log.newStatus}</>
                )}
                {log.action === 'PAYMENT_STATUS_CHANGE' && (
                  <>Pagamento: {log.metadata?.old} ➜ {log.metadata?.new}</>
                )}
                {log.action === 'CREATE' && 'Pedido criado'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
