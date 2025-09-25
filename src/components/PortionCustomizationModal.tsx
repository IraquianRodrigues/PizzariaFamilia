'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

type PortionSize = 'P' | 'G';

interface PortionCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (name: string, totalPrice: number) => void;
}

// Regra de preço: usa product.price como P; G aplica fator conforme item
// Para "Batata Frita": P=10, G=18 (fator 1.8)
// Para "Batata c/ Cheddar e Bacon": P=14, G=25 (~fator 1.7857)
function getPortionPrice(product: Product, size: PortionSize): number {
  const base = product.price; // preço P
  if (size === 'P') return base;
  // G: aplicar fator específico por produto
  if (product.id === 'batata-frita') return 18.00;
  if (product.id === 'batata-cheddar-bacon') return 25.00;
  // fallback: 1.8x
  return Math.round((base * 1.8) * 100) / 100;
}

export function PortionCustomizationModal({ isOpen, onClose, product, onAddToCart }: PortionCustomizationModalProps) {
  const [selected, setSelected] = useState<PortionSize>('P');

  useEffect(() => {
    if (isOpen) setSelected('P');
  }, [isOpen]);

  if (!isOpen) return null;

  const total = getPortionPrice(product, selected);

  const handleAdd = () => {
    const name = `${product.name} - ${selected}`;
    onAddToCart(name, total);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">🍟 Escolha o tamanho</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-56 mb-6 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden rounded-xl">
          <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Tamanhos</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {(['P', 'G'] as PortionSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelected(size)}
                  className={`border rounded-lg px-3 py-3 text-left transition ${selected === size ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:border-green-300'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{size === 'P' ? 'Pequena (150g)' : 'Grande (300g)'}</p>
                      <p className={`text-xs mt-0.5 ${selected === size ? 'text-white/80' : 'text-gray-500'}`}>
                        {size === 'P' ? 'Serve 1 pessoa' : 'Serve 2 pessoas'}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${selected === size ? 'text-white' : 'text-green-600'}`}>
                      R$ {getPortionPrice(product, size).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selecionado</p>
              <p className="font-semibold">{product.name} - {selected}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Preço</p>
              <p className="font-bold text-green-600 text-xl">R$ {total.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleAdd}>Adicionar ao Carrinho</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PortionCustomizationModal;
