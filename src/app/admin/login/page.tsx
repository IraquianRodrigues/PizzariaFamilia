"use client";
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/admin/orders';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ phone, password }) });
    const json = await res.json().catch(()=>({}));
    if (!res.ok) {
      setError(json.error || 'Erro ao autenticar');
      setLoading(false);
      return;
    }
    router.push(next);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-rose-50 p-4">
      <form onSubmit={submit} className="bg-white w-full max-w-sm rounded-xl shadow p-6 space-y-4 border">
        <h1 className="text-xl font-bold text-center">Painel • Login</h1>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Telefone</label>
          <input value={phone} onChange={e=>setPhone(e.target.value)} required className="w-full rounded border px-3 py-2 text-sm" placeholder="Ex: +5584990000000" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Senha</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} required type="password" className="w-full rounded border px-3 py-2 text-sm" placeholder="Sua senha" />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button disabled={loading} className="w-full py-2 rounded bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium disabled:opacity-50">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-[11px] text-center text-gray-500">Acesso restrito. Contate o administrador.</p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
