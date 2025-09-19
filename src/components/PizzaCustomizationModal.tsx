"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { pizzas, specialPizzas, plusSpecialPizzas, sweetPizzas } from '@/data/pizzas';
import { Product, PizzaSize } from '@/types';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { pizzaExtras, PizzaExtra, calculatePizzaPrice } from '@/data/pizzas';

interface PizzaCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product; // base pizza selecionada
  onAddToCart: (customName: string, totalPrice: number) => void;
}

const sizeLabels: Record<PizzaSize, string> = {
  pequena: 'Pequena (4 fatias)',
  media: 'Média (6 fatias)',
  grande: 'Grande (8 fatias)',
  extra_grande: 'Extra Grande (10 fatias)',
};

const sizeOrder: PizzaSize[] = ['pequena', 'media', 'grande', 'extra_grande'];

export function PizzaCustomizationModal({ isOpen, onClose, product, onAddToCart }: PizzaCustomizationModalProps) {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('media');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([product.id]);
  const [selectedExtras, setSelectedExtras] = useState<PizzaExtra[]>([]); // somente extras (type extra)
  const [selectedBorda, setSelectedBorda] = useState<PizzaExtra | null>(null); // apenas 1 borda

  // Determinar se a pizza atual é especial; se for, exibir apenas lista de especiais
  const isPlus = plusSpecialPizzas.some(p => p.id === product.id);
  const isSpecial = !isPlus && specialPizzas.some(p => p.id === product.id);
  const isSweet = !isPlus && !isSpecial && sweetPizzas.some(p => p.id === product.id);
  const flavorCatalog = isPlus
    ? plusSpecialPizzas
    : isSpecial
      ? specialPizzas
      : isSweet
        ? sweetPizzas
        : pizzas;

  useEffect(() => {
    if (isOpen) {
      setSelectedFlavors([product.id]);
      setSelectedExtras([]);
      setSelectedBorda(null);
      setSelectedSize('media');
    }
  }, [isOpen, product.id]);

  if (!isOpen) return null;

  const toggleFlavor = (id: string) => {
    setSelectedFlavors(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // manter pelo menos 1
        return prev.filter(f => f !== id);
      } else {
        if (prev.length >= 2) return prev; // limite 2 sabores
        return [...prev, id];
      }
    });
  };

  const toggleExtra = (extra: PizzaExtra) => {
    if (extra.type === 'borda') {
      setSelectedBorda(prev => prev && prev.id === extra.id ? null : extra);
    } else {
      setSelectedExtras(prev => prev.find(e => e.id === extra.id) ? prev.filter(e => e.id !== extra.id) : [...prev, extra]);
    }
  };

  const allChargeables = [...selectedExtras, ...(selectedBorda ? [selectedBorda] : [])];
  const total = calculatePizzaPrice(selectedFlavors, selectedSize, allChargeables);
  const flavorNames = flavorCatalog.filter(p => selectedFlavors.includes(p.id)).map(p => p.name);
 
  // Se por algum motivo o sabor base não estiver no catálogo (ex: mudança de categoria), garantimos fallback
  if (flavorNames.length === 0) {
    flavorNames.push(product.name);
  }
  const customName = flavorNames.length === 2
    ? `${flavorNames[0]} / ${flavorNames[1]} - ${sizeLabels[selectedSize]}`
    : `${flavorNames[0]} - ${sizeLabels[selectedSize]}`;

  const handleAdd = () => {
    onAddToCart(customName, total);
    onClose();
  };

  // Promo banner conditions: Tue-Thu, size 'grande', and all flavors traditional
  const isTueToThu = (() => { const d = new Date().getDay(); return d >= 2 && d <= 4; })();
  const traditionalIds = new Set(pizzas.map(p => p.id));
  const allTraditional = selectedFlavors.length > 0 && selectedFlavors.every(id => traditionalIds.has(id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="relative w-full h-56 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
        </div>
        <div className="p-6 space-y-6">
          {isTueToThu && selectedSize === 'grande' && allTraditional && (
              <div className="rounded-xl border border-green-200 bg-green-50 text-green-800 p-3 text-sm">
                Promoção Terça a Quinta: Pizzas G tradicionais por <span className="font-bold">R$ 35,00</span>.
              </div>
            )}
          <div>
            <h2 className="text-2xl font-bold">Personalizar Pizza</h2>
            <p className="text-gray-600 text-sm mt-1">Escolha até 2 sabores, tamanho, borda e adicionais.</p>
          </div>
          {/* Sabores */}
          <div>
            <h3 className="font-semibold mb-2">Sabores (até 2)</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {flavorCatalog.map(p => (
                <button
                  key={p.id}
                  onClick={() => toggleFlavor(p.id)}
                  className={`border rounded-lg px-3 py-2 text-sm text-left transition ${selectedFlavors.includes(p.id) ? 'bg-red-500 text-white border-red-500' : 'bg-white hover:border-red-300'}`}
                >
                  <span className="block font-medium">{p.name}</span>
                  <span className="block text-[11px] opacity-70 line-clamp-2">{p.description}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tamanho */}
          <div>
            <h3 className="font-semibold mb-2">Tamanho</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sizeOrder.map(size => {
                const baseForSize = product.prices?.[size] || 0;
                const eligiblePromo = isTueToThu && size === 'grande' && allTraditional;
                const displayPrice = eligiblePromo ? 35.0 : baseForSize;
                return (
                  <button key={size} onClick={() => setSelectedSize(size)} className={`border rounded-lg px-3 py-2 text-base sm:text-sm transition ${selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-300'}`}>
                    <span className="block font-medium">{sizeLabels[size].split('(')[0]}</span>
                    <span className="block opacity-80">
                      {eligiblePromo ? (
                        <>
                          <span className="line-through mr-1 opacity-70 text-xs sm:text-[11px]">R$ {baseForSize.toFixed(2).replace('.', ',')}</span>
                          <span className="font-bold text-green-700 text-lg sm:text-sm">R$ {displayPrice.toFixed(2).replace('.', ',')}</span>
                        </>
                      ) : (
                        <span className="font-semibold text-lg sm:text-sm">R$ {displayPrice.toFixed(2).replace('.', ',')}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Borda */}
          <div>
            <h3 className="font-semibold mb-2">Borda (opcional)</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {pizzaExtras.filter(e => e.type === 'borda').map(borda => (
                <button
                  key={borda.id}
                  onClick={() => toggleExtra(borda)}
                  className={`border rounded-lg px-3 py-2 text-sm flex justify-between items-center transition ${selectedBorda?.id === borda.id ? 'bg-purple-600 text-white border-purple-600' : 'bg-white hover:border-purple-300'}`}
                >
                  <span>{borda.name.replace('Borda ', '')}</span>
                  <span className="text-xs font-medium">R$ {borda.price.toFixed(2).replace('.', ',')}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Adicionais */}
          <div>
            <h3 className="font-semibold mb-2">Adicionais</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {pizzaExtras.filter(e => e.type === 'extra').map(extra => (
                <button key={extra.id} onClick={() => toggleExtra(extra)} className={`border rounded-lg px-3 py-2 text-sm flex justify-between items-center transition ${selectedExtras.find(e => e.id === extra.id) ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:border-green-300'}`}>
                  <span>{extra.name}</span>
                  <span className="text-xs font-medium">R$ {extra.price.toFixed(2).replace('.', ',')}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resumo */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <h4 className="font-semibold">Resumo</h4>
            <p className="text-sm">{customName}</p>
            {(selectedBorda || selectedExtras.length > 0) && (
              <p className="text-xs text-gray-600">
                {selectedBorda && <><strong>Borda:</strong> {selectedBorda.name.replace('Borda ', '')}{selectedExtras.length > 0 && ' | '}</>}
                {selectedExtras.length > 0 && <>Extras: {selectedExtras.map(e => e.name).join(', ')}</>}
              </p>
            )}
            <p className="font-extrabold text-2xl sm:text-xl text-green-600">Total: R$ {total.toFixed(2).replace('.', ',')}</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleAdd} className="bg-red-600 hover:bg-red-700">Adicionar ao Carrinho</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
