"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/cartContext";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { products } from "@/data/products";
import { pizzas as pizzasTrad, sweetPizzas } from "@/data/pizzas";

export default function PromoSextaCard() {
  const [isFriday, setIsFriday] = useState(false);
  const { addToCart } = useCart();
  const { success, warning } = useToast();

  // Modal state
  const [open, setOpen] = useState(false);
  const [pizzaTradId, setPizzaTradId] = useState<string | null>(null);
  const [pizzaDoceId, setPizzaDoceId] = useState<string | null>(null);
  const [drinkId, setDrinkId] = useState<string | null>(null);

  useEffect(() => {
    // 0=Dom, 1=Seg ... 5=Sexta, 6=Sáb
    setIsFriday(new Date().getDay() === 5);
  }, []);

  const traditionalOptions = useMemo(() => {
    // Tradicionais salgadas (exclui chocolate que no dataset vem com tag 'Doce')
    return pizzasTrad.filter(p => !p.tags.includes('Doce'));
  }, []);

  const sweetOptions = useMemo(() => {
    // Opções doces: todas as sweetPizzas + a pizza 'chocolate' (que está no array de tradicionais)
    const choco = pizzasTrad.find(p => p.id === 'chocolate');
    return choco ? [choco, ...sweetPizzas] : sweetPizzas;
  }, []);

  const drinkOptions = useMemo(() => {
    // Somente refrigerantes 1L
    return products.filter(
      p => p.category === 'drink' && p.tags.includes('Refrigerante') && /1L/i.test(p.name)
    );
  }, []);

  // Initialize defaults when opening the modal first time
  useEffect(() => {
    if (open) {
      if (!pizzaTradId && traditionalOptions.length) setPizzaTradId(traditionalOptions[0].id);
      if (!pizzaDoceId && sweetOptions.length) setPizzaDoceId(sweetOptions[0].id);
      if (!drinkId && drinkOptions.length) setDrinkId(drinkOptions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!isFriday) return null;

  const handleAddCombo = () => {
    if (!pizzaTradId || !pizzaDoceId || !drinkId) {
      setOpen(true);
      warning('Quase lá!', 'Escolha os sabores do combo antes de adicionar.');
      return;
    }
    // Salva customizações com as escolhas do combo
    const trad = traditionalOptions.find(p => p.id === pizzaTradId);
    const doce = sweetOptions.find(p => p.id === pizzaDoceId);
    const drink = drinkOptions.find(p => p.id === drinkId);
    const customs = [
      { addonId: `pizza-g-${trad?.id}`, addonName: `Pizza G Tradicional: ${trad?.name}`, price: 0, quantity: 1 },
      { addonId: `pizza-p-${doce?.id}`, addonName: `Pizza P Doce: ${doce?.name}`, price: 0, quantity: 1 },
      { addonId: `refrigerante-1l-${drink?.id}`, addonName: `Refrigerante 1L: ${drink?.name}`, price: 0, quantity: 1 },
    ];
    addToCart("Combo Sexta Especial", 60, customs);
    success("Adicionado!", "Combo Sexta Especial adicionado ao carrinho");
    setOpen(false);
  };

  return (
    <section className="mb-4">
      <div className="w-full rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="relative w-full h-56 bg-amber-50">
          <Image
            src="/assets/combo.jpeg"
            alt="Combo Sexta Especial"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Somente às sextas
          </span>
        </div>

        <div className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Combo Sexta Especial</h2>
              <ul className="text-sm text-gray-700 list-disc pl-5 mt-2 space-y-1">
                <li>1 Pizza G Tradicional</li>
                <li>1 Pizza P Doce</li>
                <li>1 Refrigerante de 1L</li>
              </ul>
              {(pizzaTradId || pizzaDoceId || drinkId) && (
                <div className="mt-2 text-xs text-gray-600">
                  <div>Selecionado:</div>
                  <div className="mt-1 space-y-0.5">
                    {pizzaTradId && <div>• Pizza G: {traditionalOptions.find(p => p.id === pizzaTradId)?.name}</div>}
                    {pizzaDoceId && <div>• Pizza P: {sweetOptions.find(p => p.id === pizzaDoceId)?.name}</div>}
                    {drinkId && <div>• Refri 1L: {drinkOptions.find(p => p.id === drinkId)?.name}</div>}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-end md:items-center gap-3 md:flex-col md:gap-2 md:text-right">
              <span className="text-2xl font-extrabold text-amber-600">R$ 60,00</span>
              <Button variant="outline" onClick={() => setOpen(true)} className="md:w-full">Escolher sabores</Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha os sabores do Combo</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pizza G Tradicional</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={pizzaTradId ?? ""}
                onChange={(e) => setPizzaTradId(e.target.value)}
              >
                {traditionalOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pizza P Doce</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={pizzaDoceId ?? ""}
                onChange={(e) => setPizzaDoceId(e.target.value)}
              >
                {sweetOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Refrigerante 1L</label>
              <select
                className="w-full rounded border px-3 py-2 text-sm"
                value={drinkId ?? ""}
                onChange={(e) => setDrinkId(e.target.value)}
              >
                {drinkOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddCombo}>Adicionar ao carrinho</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
