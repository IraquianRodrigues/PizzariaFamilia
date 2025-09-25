'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { formatBRL } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '../hooks/cartContext';
import { pizzas as traditionalPizzas, specialPizzas, plusSpecialPizzas, sweetPizzas } from '@/data/pizzas';
import { Trash2, Plus, Minus, ShoppingCart, MapPin, CreditCard, Wallet, ChevronDown, Copy, Check, AlertTriangle } from 'lucide-react';
import { CartItem } from '@/types';

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
    const router = useRouter();
    // Número do WhatsApp do estabelecimento (E.164 sem '+') e chave PIX (configuráveis via env)
    const WHATSAPP_PHONE = (process.env.NEXT_PUBLIC_WHATSAPP_PHONE as string | undefined) || '5584998169843';
    const PIX_KEY = (process.env.NEXT_PUBLIC_PIX_KEY as string | undefined) || WHATSAPP_PHONE;
    const PIX_NAME = (process.env.NEXT_PUBLIC_PIX_NAME as string | undefined) || 'Francisco Gildazio';
    const [address, setAddress] = useState('');
    const [deliveryType, setDeliveryType] = useState<'entrega' | 'retirada'>('entrega');
    // Bairro e taxa de entrega
    const neighborhoods = [
        { name: 'Cidade Alta (Rua porto velho)', fee: 0 },
        { name: 'Alto do Sumaré – Cidade Alta', fee: 1 },
        { name: 'Alto do Sumaré', fee: 4 },
        { name: 'Bom Jesus', fee: 7 },
        { name: 'Alto de São Manoel', fee: 7 },
        { name: 'Ilha de Santa Luzia', fee: 8 },
        { name: 'Dom Jaime Câmara', fee: 7 },
        { name: 'Ingá', fee: 10 },
        { name: 'Belo Horizonte', fee: 12 },
        { name: 'Planalto 13 de Maio', fee: 7 },
    ];
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(0);
    // Novos campos de dados do cliente
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [formStatus, setFormStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [referencePoint, setReferencePoint] = useState(''); // ponto de referência opcional

    const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useCart();

    // Pagamento
    const [paymentMethod, setPaymentMethod] = useState<'credito' | 'debito' | 'pix' | 'dinheiro'>('pix');
    const [changeNeeded, setChangeNeeded] = useState(false);
    const [changeFor, setChangeFor] = useState('');
    const [pixCopied, setPixCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subtotal = getCartTotal();
    const finalTotal = subtotal + (deliveryType === 'entrega' ? deliveryFee : 0); // inclui taxa de entrega apenas quando for entrega

    // Persistir nome e telefone localmente (qualidade de vida)
    useEffect(() => {
    const savedName = localStorage.getItem('pizzariaFamiliaCustomerName');
    const savedPhone = localStorage.getItem('pizzariaFamiliaCustomerPhone');
        if (savedName) setCustomerName(savedName);
        if (savedPhone) setCustomerPhone(savedPhone);
    }, []);

    useEffect(() => {
    if (customerName) localStorage.setItem('pizzariaFamiliaCustomerName', customerName);
    }, [customerName]);

    useEffect(() => {
    if (customerPhone) localStorage.setItem('pizzariaFamiliaCustomerPhone', customerPhone);
    }, [customerPhone]);

    // Restaurar bairro e taxa salvos
    useEffect(() => {
        try {
            const savedNeighborhood = localStorage.getItem('pizzariaFamiliaNeighborhood') || '';
            const savedFee = localStorage.getItem('pizzariaFamiliaDeliveryFee');
            if (savedNeighborhood) setSelectedNeighborhood(savedNeighborhood);
            if (savedFee) setDeliveryFee(parseFloat(savedFee));
        } catch {}
    }, []);

    useEffect(() => {
        try {
            if (selectedNeighborhood) {
                localStorage.setItem('pizzariaFamiliaNeighborhood', selectedNeighborhood);
                localStorage.setItem('pizzariaFamiliaDeliveryFee', String(deliveryFee));
            } else {
                localStorage.removeItem('pizzariaFamiliaNeighborhood');
                localStorage.removeItem('pizzariaFamiliaDeliveryFee');
            }
        } catch {}
    }, [selectedNeighborhood, deliveryFee]);

    // Máscara de telefone brasileiro
    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 2) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    };
    const phoneDigits = useMemo(() => customerPhone.replace(/\D/g, ''), [customerPhone]);
    const isValidPhone = phoneDigits.length === 10 || phoneDigits.length === 11;

    const handleCopyPix = async () => {
        try {
            await navigator.clipboard.writeText(PIX_KEY);
            setPixCopied(true);
            setTimeout(() => setPixCopied(false), 2000);
        } catch {
            // ignore
        }
    };


    const handleCheckout = async () => {
        if (cart.length === 0) return;

        if (!customerName.trim() || !customerPhone.trim() || !isValidPhone || (deliveryType === 'entrega' && (!address.trim() || !selectedNeighborhood))) {
            setFormStatus({ message: deliveryType === 'entrega' ? 'Informe nome, telefone válido, endereço e bairro.' : 'Informe nome e telefone válido.', type: 'error' });
            return;
        }

        if (paymentMethod === 'dinheiro' && changeNeeded) {
            const val = parseFloat(changeFor.replace(',', '.'));
            if (isNaN(val) || val <= finalTotal) {
                setFormStatus({ message: 'Valor para troco inválido ou menor que o total.', type: 'error' });
                return;
            }
        }

        const now = new Date();
        const hour = now.getHours();
        const isOpen = hour >= 18 && hour < 22;
        if (!isOpen) {
            setFormStatus({ message: 'Ops, a hamburgueria está fechada no momento!', type: 'error' });
            return;
        }

        const allPizzaNames = [
            ...traditionalPizzas,
            ...specialPizzas,
            ...plusSpecialPizzas,
            ...sweetPizzas,
        ].map(p => p.name.toLowerCase());

        const isPizzaItem = (name: string) => {
            const n = name.toLowerCase();
            return allPizzaNames.some(base => n.includes(base));
        };

        const formatItemName = (name: string) => {
            if (isPizzaItem(name) && !/^pizza\s/i.test(name)) {
                return `Pizza ${name}`;
            }
            return name;
        };

        const itemsBlock = cart.map((item: CartItem) => {
            const lineTotal = formatBRL(item.quantity * item.price);
            const label = formatItemName(item.name);
            return `- ${label} x${item.quantity} - ${lineTotal}`;
        }).join('\n');
    const refLine = referencePoint.trim() ? `\nReferência: ${referencePoint.trim()}` : '';
        const pagamentoLinha = paymentMethod === 'dinheiro'
            ? `💳 *Pagamento:* Dinheiro${changeNeeded && changeFor ? ` (Troco para R$ ${parseFloat(changeFor.replace(',', '.')).toFixed(2).replace('.', ',')})` : ''}`
            : paymentMethod === 'pix'
                ? '💳 *Pagamento:* PIX'
                : paymentMethod === 'credito'
                    ? '💳 *Pagamento:* Cartão Crédito'
                    : '💳 *Pagamento:* Cartão Débito';

    const headerIcon = '*PEDIDO PIZZARIA FAMÍLIA*';
    const clienteLabel = 'Cliente';
    const tipoEntregaLabel = 'Tipo';
        const telefoneLabel = 'Telefone';
        const enderecoLabel = 'Endereço';
        const bairroLabel = 'Bairro';
        const itensLabel = 'Itens';
        const subtotalLabel = 'Subtotal';
        const entregaLabel = 'Entrega';
        const totalLabel = 'Total';
        const obrigadoIcon = 'Obrigado pelo pedido!';
        const pagamentoIcon = pagamentoLinha.replace('💳 ', ''); // sem emoji
        const sep = '--------------------';

        const policyLine = paymentMethod === 'pix' ? 'Obs: o pedido só será aceito mediante envio do comprovante do PIX.' : '';

        const whatsappMessage = [
            headerIcon,
            sep,
            `*${clienteLabel}:* ${customerName}`,
            `*${telefoneLabel}:* ${customerPhone}`,
            `*${tipoEntregaLabel}:* ${deliveryType === 'entrega' ? 'Entrega' : 'Retirada'}`,
            ...(deliveryType === 'entrega' ? [`*${enderecoLabel}:* ${address}${refLine}`] : []),
            ...(deliveryType === 'entrega' ? [`*${bairroLabel}:* ${selectedNeighborhood} (Taxa ${formatBRL(deliveryFee)})`] : []),
            sep,
            `*${itensLabel}:*`,
            itemsBlock,
            sep,
            pagamentoIcon,
            `${subtotalLabel}: ${formatBRL(subtotal)}`,
            ...(deliveryType === 'entrega' ? [`${entregaLabel}: ${formatBRL(deliveryFee)}`] : []),
            `*${totalLabel}:* ${formatBRL(finalTotal)}`,
            ...(policyLine ? [policyLine] : []),
            obrigadoIcon
        ].join('\n');

        // Montar payload compatível com /api/orders (novo backend)
        const paymentMethodMap: Record<string, 'CASH' | 'PIX' | 'CARD'> = {
            dinheiro: 'CASH',
            pix: 'PIX',
            credito: 'CARD',
            debito: 'CARD'
        };

        const deliveryAddress = deliveryType === 'entrega'
            ? `${address}${selectedNeighborhood ? ' - ' + selectedNeighborhood : ''}${referencePoint ? ' (Ref: ' + referencePoint + ')' : ''}`
            : 'Retirada no balcão';

        const changeForNumber = paymentMethod === 'dinheiro' && changeNeeded && changeFor
            ? parseFloat(changeFor.replace(',', '.'))
            : undefined;

        const orderPayload = {
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            deliveryAddress: deliveryType === 'entrega' ? deliveryAddress : undefined,
            notes: whatsappMessage, // aproveitamos a mensagem como observação completa
            paymentMethod: paymentMethodMap[paymentMethod],
            changeFor: changeForNumber,
            items: cart.map((i: CartItem) => ({
                productName: i.name,
                basePrice: i.price,
                quantity: i.quantity,
                category: undefined
            })),
            discount: 0
        };

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload)
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                setFormStatus({ message: 'Erro ao registrar pedido: ' + (errJson.error || res.statusText), type: 'error' });
                setIsSubmitting(false);
                return;
            }

            // Abre WhatsApp para envio manual ainda (fluxo existente)
            window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');

            clearCart();
            setAddress('');
            setSelectedNeighborhood('');
            setDeliveryFee(0);
            setCustomerName('');
            setCustomerPhone('');
            setReferencePoint('');
            setFormStatus({ message: 'Pedido enviado com sucesso!', type: 'success' });
            onClose();
            // Redirecionar para dashboard de pedidos
            router.push('/admin/orders');
        } catch (e: unknown) {
            console.error('Erro inesperado ao criar pedido', e);
            setFormStatus({ message: 'Falha inesperada ao criar pedido.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuantityChange = (name: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(name);
        } else {
            updateQuantity(name, newQuantity);
        }
    };

    if (getCartCount() === 0) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6" />
                            Carrinho de Compras
                        </DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-8">
                        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Seu carrinho está vazio</p>
                        <p className="text-gray-400">Adicione alguns produtos para começar!</p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-6 h-6" />
                        Carrinho de Compras ({getCartCount()})
                    </DialogTitle>
                </DialogHeader>

                {/* Itens do carrinho */}
                <div className="space-y-4">
                    {cart.map((item: CartItem) => (
                        <div key={item.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-gray-600">
                                    {formatBRL(item.price)} cada
                                </p>
                                <p className="text-green-600 font-semibold">
                                    Subtotal: {formatBRL(item.price * item.quantity)}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuantityChange(item.name, item.quantity - 1)}
                                        className="w-8 h-8 p-0"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>

                                    <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                                        {item.quantity}
                                    </Badge>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuantityChange(item.name, item.quantity + 1)}
                                        className="w-8 h-8 p-0"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeFromCart(item.name)}
                                    className="w-8 h-8 p-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Tipo de Entrega */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">🚚 Tipo de Entrega</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'entrega', label: 'Entrega' },
                            { id: 'retirada', label: 'Retirada' },
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setDeliveryType(opt.id as 'entrega' | 'retirada')}
                                className={`border rounded-lg py-2 text-sm font-medium transition ${deliveryType === opt.id ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:border-emerald-300'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    {deliveryType === 'retirada' && (
                        <p className="text-xs text-gray-500">Retirar no balcão. Endereço de entrega não é necessário.</p>
                    )}
                </div>

                <Separator />

                {/* Pagamento */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Wallet className="w-5 h-5" /> Forma de Pagamento</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                            { id: 'pix', label: 'PIX' },
                            { id: 'credito', label: 'Crédito' },
                            { id: 'debito', label: 'Débito' },
                            { id: 'dinheiro', label: 'Dinheiro' },
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => setPaymentMethod(opt.id as 'pix' | 'credito' | 'debito' | 'dinheiro')}
                                className={`border rounded-lg py-2 text-sm font-medium transition ${paymentMethod === opt.id ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:border-green-300'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    {paymentMethod === 'dinheiro' && (
                        <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={changeNeeded} onChange={(e) => setChangeNeeded(e.target.checked)} />
                                Precisa de troco?
                            </label>
                            {changeNeeded && (
                                <Input
                                    placeholder="Troco para quanto? Ex: 100,00"
                                    value={changeFor}
                                    onChange={(e) => setChangeFor(e.target.value)}
                                />
                            )}
                        </div>
                    )}
                    {paymentMethod === 'pix' && (
                        <div className="space-y-2 border rounded-lg p-3 bg-green-50">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-green-800">Chave PIX</p>
                                <button
                                    type="button"
                                    onClick={handleCopyPix}
                                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border bg-white hover:bg-gray-50"
                                >
                                    {pixCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    {pixCopied ? 'Copiado' : 'Copiar'}
                                </button>
                            </div>
                            <code className="block w-full truncate border rounded-md bg-white px-3 py-2 text-sm">{PIX_KEY}</code>
                            <p className="text-xs text-green-900 mt-1">Recebedor: <span className="font-semibold text-green-950">{PIX_NAME}</span></p>
                            <p className="text-xs text-green-900">
                                Faça o pagamento via PIX e em seguida envie o comprovante pelo WhatsApp para agilizar o envio.
                            </p>
                            <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5" />
                                <span>Importante: o pedido só será aceito mediante o envio do comprovante do pagamento via PIX.</span>
                            </div>
                            <a
                                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Enviei o comprovante do pedido via PIX.')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-green-700 underline hover:text-green-800"
                            >
                                Enviar comprovante no WhatsApp
                            </a>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Dados do Cliente */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">👤 Dados do Cliente</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            placeholder="Nome completo"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                        <div className="space-y-1">
                            <Input
                                placeholder="Telefone (WhatsApp)"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
                                onBlur={() => setPhoneTouched(true)}
                                maxLength={15}
                            />
                            {phoneTouched && !isValidPhone && (
                                <p className="text-xs text-red-600">Telefone inválido. Use DDD + número (10 ou 11 dígitos).</p>
                            )}
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Endereço de entrega */}
                {deliveryType === 'entrega' && (
                <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Endereço de Entrega
                    </h3>
                    <p className="text-xs text-gray-500 -mt-1">Selecione o bairro para calcular a taxa de entrega.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            placeholder="Digite seu endereço completo"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        <div className="space-y-1">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <select
                                className="w-full border rounded-md h-10 pl-9 pr-10 text-sm bg-white appearance-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                value={selectedNeighborhood}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedNeighborhood(val);
                                    const found = neighborhoods.find(n => n.name === val);
                                    setDeliveryFee(found ? found.fee : 0);
                                }}
                                >
                                    <option value="">Selecione o bairro</option>
                                    {neighborhoods.map(n => (
                                        <option key={n.name} value={n.name}>
                                            {n.name} — R$ {n.fee.toFixed(2).replace('.', ',')}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {selectedNeighborhood && (
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-[11px]">Taxa {formatBRL(deliveryFee)}</Badge>
                                    <span className="text-xs text-gray-500">para {selectedNeighborhood}</span>
                                    <button
                                        type="button"
                                        className="text-xs text-red-600 underline"
                                        onClick={() => { setSelectedNeighborhood(''); setDeliveryFee(0); }}
                                    >
                                        limpar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <Input
                        placeholder="Ponto de referência (opcional)"
                        value={referencePoint}
                        onChange={(e) => setReferencePoint(e.target.value)}
                    />
                </div>
                )}

                <Separator />

                {/* Resumo do pedido */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">📋 Resumo do Pedido</h3>

                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatBRL(subtotal)}</span>
                        </div>
                        {deliveryType === 'entrega' && (
                        <div className="flex justify-between">
                            <span>Entrega ({selectedNeighborhood || 'sem bairro selecionado'}):</span>
                            <span>{formatBRL(deliveryFee)}</span>
                        </div>
                        )}

                        <Separator />

                        <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>{formatBRL(finalTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Botões de ação */}
                <div className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={clearCart}
                        className="flex-1"
                    >
                        Limpar Carrinho
                    </Button>

                    <Button
                        onClick={handleCheckout}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={
                            isSubmitting ||
                            !customerName.trim() || !customerPhone.trim() || !isValidPhone ||
                            (deliveryType === 'entrega' && (!address.trim() || !selectedNeighborhood))
                        }
                    >
                        <CreditCard className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Enviando...' : 'Finalizar Pedido'}
                    </Button>
                </div>
                {formStatus && (
                    <div className={`text-sm p-2 rounded ${formStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {formStatus.message}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

