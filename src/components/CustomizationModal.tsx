'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CustomizationModalProps, Customization, Addon } from '@/types';
import { addons, addonCategories, calculateAddonDiscount } from '@/data/addons';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';

// Novo layout inspirado no modal de pizza
export function CustomizationModal({ isOpen, onClose, product, onAddToCart }: CustomizationModalProps) {
    const [selectedAddons, setSelectedAddons] = useState<Customization[]>([]);

    if (!isOpen) return null;

    const basePrice = product.price;
    const addonsTotal = selectedAddons.reduce((t, a) => t + a.price * a.quantity, 0);
    const addonCount = selectedAddons.reduce((t, a) => t + a.quantity, 0);
    const discount = calculateAddonDiscount(addonCount);
    const discountAmount = addonsTotal * discount;
    const finalPrice = basePrice + addonsTotal - discountAmount;

    const addAddon = (addon: Addon) => {
        setSelectedAddons(prev => {
            const existing = prev.find(p => p.addonId === addon.id);
            if (existing) {
                if (addon.maxQuantity && existing.quantity >= addon.maxQuantity) return prev;
                return prev.map(p => p.addonId === addon.id ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { addonId: addon.id, addonName: addon.name, price: addon.price, quantity: 1 }];
        });
    };

    const removeAddon = (addonId: string) => {
        setSelectedAddons(prev => {
            const existing = prev.find(p => p.addonId === addonId);
            if (existing && existing.quantity > 1) {
                return prev.map(p => p.addonId === addonId ? { ...p, quantity: p.quantity - 1 } : p);
            }
            return prev.filter(p => p.addonId !== addonId);
        });
    };

    const removeAddonCompletely = (addonId: string) => setSelectedAddons(prev => prev.filter(p => p.addonId !== addonId));
    const clearSelections = () => setSelectedAddons([]);

    const canAddCheese = (addon: Addon) => {
        if (addon.category !== 'cheese') return true;
        const cheeseCount = selectedAddons.filter(s => addons.find(a => a.id === s.addonId)?.category === 'cheese').reduce((t, s) => t + s.quantity, 0);
        return cheeseCount < 1;
    };
    const canAddProtein = (addon: Addon) => {
        if (addon.category !== 'protein') return true;
        const proteinCount = selectedAddons.filter(s => addons.find(a => a.id === s.addonId)?.category === 'protein').reduce((t, s) => t + s.quantity, 0);
        return proteinCount < 2;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">🍔 Personalizar: {product.name}</DialogTitle>
                </DialogHeader>
                {/* Imagem topo */}
                <div className="relative w-full h-56 mb-6 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden rounded-xl">
                    <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
                </div>
                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold">Adicionais</h2>
                        <p className="text-gray-600 text-sm mt-1">Queijos: 1 tipo • Proteínas: 2 tipos • Desconto progressivo.</p>
                    </div>
                    {/* Adicionais por categoria (estilo grid como pizza) */}
                    <div className="space-y-6">
                        {addonCategories.map(category => {
                            const categoryAddons = addons.filter(a => a.category === category.id);
                            return (
                                <div key={category.id} className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                                        <span className="text-2xl">{category.icon}</span>{category.name}
                                    </h3>
                                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {categoryAddons.map(addon => {
                                            const selected = selectedAddons.find(s => s.addonId === addon.id);
                                            const canAdd = addon.isAvailable && (addon.category !== 'cheese' || canAddCheese(addon)) && (addon.category !== 'protein' || canAddProtein(addon));
                                            return (
                                                <div key={addon.id} className={`relative border rounded-lg p-3 text-sm flex flex-col gap-2 transition ${selected ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:border-green-300'} ${!canAdd ? 'opacity-50 pointer-events-none' : ''}`}>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium truncate">{addon.name}</p>
                                                            <p className={`text-xs mt-0.5 line-clamp-2 ${selected ? 'text-white/80' : 'text-gray-500'}`}>{addon.description}</p>
                                                        </div>
                                                        {addon.maxQuantity && (
                                                            <Badge variant="secondary" className={`text-[10px] ${selected ? 'bg-white/20 text-white' : ''}`}>Máx: {addon.maxQuantity}</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between mt-auto">
                                                        <span className={`text-xs font-semibold ${selected ? 'text-white' : 'text-green-600'}`}>+R$ {addon.price.toFixed(2).replace('.', ',')}</span>
                                                        {!selected ? (
                                                            <Button size="sm" onClick={() => addAddon(addon)} className={`h-7 px-3 text-xs ${selected ? 'bg-white text-green-700' : 'bg-green-600 hover:bg-green-700'}`}>Adicionar</Button>
                                                        ) : (
                                                            <div className="flex items-center gap-1">
                                                                <Button variant="outline" size="icon" onClick={() => removeAddon(addon.id)} className={`h-7 w-7 ${selected ? 'bg-white text-green-700 hover:bg-white' : ''}`}>
                                                                    <Minus className="w-3 h-3" />
                                                                </Button>
                                                                <span className="text-xs font-medium w-6 text-center">{selected.quantity}</span>
                                                                <Button variant="outline" size="icon" onClick={() => addAddon(addon)} disabled={addon.maxQuantity ? selected.quantity >= addon.maxQuantity : false} className={`h-7 w-7 ${selected ? 'bg-white text-green-700 hover:bg-white' : ''}`}>
                                                                    <Plus className="w-3 h-3" />
                                                                </Button>
                                                                <Button variant="destructive" size="icon" onClick={() => removeAddonCompletely(addon.id)} className="h-7 w-7">
                                                                    <X className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Separator />

                    {/* Resumo */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <h4 className="font-semibold">Resumo</h4>
                        <p className="text-sm">{product.name}</p>
                        {selectedAddons.length > 0 && (
                            <div className="space-y-1">
                                {selectedAddons.map(a => (
                                    <div key={a.addonId} className="flex justify-between text-xs">
                                        <span>{a.addonName} (x{a.quantity})</span>
                                        <span>R$ {(a.price * a.quantity).toFixed(2).replace('.', ',')}</span>
                                    </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between text-xs">
                                    <span>Subtotal adicionais</span>
                                    <span>R$ {addonsTotal.toFixed(2).replace('.', ',')}</span>
                                </div>
                            </div>
                        )}
                        {discount > 0 && (
                            <div className="flex justify-between text-xs text-green-600">
                                <span>Desconto ({Math.round(discount * 100)}%)</span>
                                <span>-R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-1">
                            <span>Total</span>
                            <span className="text-green-600">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
                        </div>
                        {addonCount > 0 && (
                            <p className="text-[11px] text-gray-500 text-center mt-1">{addonCount} adicional{addonCount > 1 ? 'es' : ''} selecionado{addonCount > 1 ? 's' : ''}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={clearSelections} disabled={selectedAddons.length === 0}>Limpar</Button>
                        <Button onClick={() => { onAddToCart(selectedAddons, finalPrice); clearSelections(); onClose(); }} className="bg-green-600 hover:bg-green-700" disabled={selectedAddons.length === 0}>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {selectedAddons.length === 0 ? 'Selecione Adicionais' : 'Adicionar ao Carrinho'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
