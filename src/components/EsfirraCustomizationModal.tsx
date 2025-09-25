'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (name: string, price: number) => void;
}

const DOCES = [
  'Chocolate',
  'Dois amores',
];

const SALGADOS = [
  'Calabresa',
  'Calabresa com catupiry',
  'Frango mussarela',
  'Frango com catupiry',
  'Carne de sol',
  'Carne com catupiry',
  'Mista',
];

export function EsfirraCustomizationModal({ isOpen, onClose, product, onAddToCart }: Props) {
  const [selected, setSelected] = useState<string>('Chocolate');

  useEffect(() => {
    if (isOpen) setSelected('Chocolate');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = () => {
    const name = `Esfirra - ${selected}`;
    onAddToCart(name, product.price);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">🥙 Escolha sua Esfirra</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-56 mb-6 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center overflow-hidden rounded-xl">
          <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Doces</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {DOCES.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelected(opt)}
                  className={`border rounded-lg px-3 py-2 text-sm text-left transition ${selected === opt ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:border-green-300'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-2">Salgados</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {SALGADOS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelected(opt)}
                  className={`border rounded-lg px-3 py-2 text-sm text-left transition ${selected === opt ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:border-green-300'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selecionado</p>
              <p className="font-semibold">{selected}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Preço</p>
              <p className="font-bold text-green-600 text-xl">R$ {product.price.toFixed(2).replace('.', ',')}</p>
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
