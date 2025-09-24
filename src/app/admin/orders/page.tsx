"use client";
import useSWR from 'swr';
import { useState } from 'react';
import { format } from 'date-fns';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface OrderListItem {
  id: string;
  code: number;
  customerName: string;
  customerPhone: string;
  status: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  _count: { items: number };
}

const statusLabels: Record<string,string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  OUT_FOR_DELIVERY: 'Saiu',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado'
};

function StatusBadge({ status }: { status: string }) {
  const base = 'px-2 py-0.5 rounded text-xs font-medium';
  const color = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-indigo-100 text-indigo-700',
    OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELED: 'bg-red-100 text-red-700'
  }[status] || 'bg-gray-100 text-gray-600';
  return <span className={base + ' ' + color}>{statusLabels[status] || status}</span>;
}

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<string>('');
  const { data, mutate, isLoading } = useSWR<{ data: OrderListItem[] }>(`/api/orders${filter ? `?status=${filter}` : ''}`, fetcher, { refreshInterval: 10000 });

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    mutate();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
      <div className="flex gap-2 flex-wrap mb-4">
        {['', 'PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELED'].map(s => (
          <button key={s || 'all'} onClick={() => setFilter(s)} className={`text-sm px-3 py-1 rounded-full border ${filter===s ? 'bg-amber-500 text-white border-amber-500' : 'bg-white hover:bg-gray-50'}`}>{s ? statusLabels[s] : 'Todos'}</button>
        ))}
      </div>
      {isLoading && <p>Carregando...</p>}
      <div className="overflow-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Telefone</th>
              <th className="p-2">Itens</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
              <th className="p-2">Pagamento</th>
              <th className="p-2">Criado</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((o: OrderListItem) => (
              <tr key={o.id} className="border-t">
                <td className="p-2 font-mono text-xs">{o.code}</td>
                <td className="p-2 font-medium">{o.customerName}</td>
                <td className="p-2">{o.customerPhone}</td>
                <td className="p-2">{o._count.items}</td>
                <td className="p-2 font-semibold text-green-600">R$ {o.total.toFixed(2)}</td>
                <td className="p-2"><StatusBadge status={o.status} /></td>
                <td className="p-2 text-xs">{o.paymentMethod}</td>
                <td className="p-2 text-xs whitespace-nowrap">{format(new Date(o.createdAt), 'dd/MM HH:mm')}</td>
                <td className="p-2 space-x-1">
                  {['CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED'].map(st => (
                    <button key={st} onClick={() => updateStatus(o.id, st)} className="text-[10px] px-2 py-1 rounded border bg-white hover:bg-gray-50">{statusLabels[st]}</button>
                  ))}
                </td>
              </tr>
            ))}
            {!data?.data?.length && !isLoading && (
              <tr><td colSpan={9} className="p-4 text-center text-gray-500">Nenhum pedido</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-gray-500 mt-4">Atualiza a cada 10s · Protótipo inicial (sem auth ainda).</p>
    </div>
  );
}
