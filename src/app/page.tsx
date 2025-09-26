"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { products } from '@/data/products';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { CartModal } from '@/components/CartModal';
import { CustomizationModal } from '@/components/CustomizationModal';
import { PizzaCustomizationModal } from '@/components/PizzaCustomizationModal';
import { EsfirraCustomizationModal } from '@/components/EsfirraCustomizationModal';
import { PortionCustomizationModal } from '@/components/PortionCustomizationModal';
import { useCart } from '@/hooks/cartContext';
import { ShoppingCart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/useToast';
import { FilterType } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToastContainer } from '@/components/ui/toast';
import PromoSextaCard from '@/components/PromoSextaCard';

export default function HomePage() {
  const ENABLE_BURGERS = (process.env.NEXT_PUBLIC_ENABLE_BURGERS ?? 'true') !== 'false';
  const { addToCart, getCartCount } = useCart();
  const { favorites } = useFavorites();
  const { success, toasts, removeToast } = useToast();

  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  // Horário de funcionamento (exemplo: 18:00 - 23:30)
 
  const OPEN_HOUR = 18; // 18h
  const CLOSE_HOUR = 23; // Fecha às 23:00 (não inclui 23:00)
  const [isOpenNow, setIsOpenNow] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours();
      const day = now.getDay(); // 0=Dom 1=Seg 2=Ter ... 6=Sáb
      const isOpenDay = day !== 1; // fechado somente na segunda-feira
      const withinHours = hours >= OPEN_HOUR && hours < CLOSE_HOUR; // 18:00 <= hora < 23:00
      const open = isOpenDay && withinHours;
      setIsOpenNow(open);
    };
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, []);
  // (Busca e ordenação removidas)

  // Modais simples (reutilizando componentes já existentes)
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [currentCustomizationProduct, setCurrentCustomizationProduct] = useState<Product | null>(null);
  const [isEsfirraModalOpen, setIsEsfirraModalOpen] = useState(false);
  const [isPortionModalOpen, setIsPortionModalOpen] = useState(false);

  // Promoção Terça a Quinta para pizzas tradicionais G
  const isTueToThuPromo = (() => { const d = new Date().getDay(); return d >= 2 && d <= 4; })();

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (currentFilter === 'favorites') list = list.filter(p => favorites.includes(p.name));
    else if (currentFilter === 'burgers') list = list.filter(p => p.category === 'burger');
    else if (currentFilter === 'drinks') list = list.filter(p => p.category === 'drink');
    else if (currentFilter === 'massas') list = list.filter(p => p.category === 'dish');
    else if (currentFilter === 'porcoes') list = list.filter(p => p.tags.includes('Porção'));
    else if (currentFilter === 'pizzas') list = list.filter(p => p.category === 'pizza' && !p.tags.includes('⭐ Especial'));
    else if (currentFilter === 'pizzas-especiais') list = list.filter(p => p.category === 'pizza' && p.tags.includes('⭐ Especial') && !p.tags.includes('🔥 Plus'));
    else if (currentFilter === 'pizzas-plus-especiais') list = list.filter(p => p.category === 'pizza' && p.tags.includes('🔥 Plus'));
  else if (currentFilter === 'pizzas-doces') list = list.filter(p => p.category === 'pizza' && p.tags.includes('🍫 Doce'));
    // Se lanches estiverem desativados, remover categoria burger de qualquer lista
    if (!ENABLE_BURGERS) {
      list = list.filter(p => p.category !== 'burger');
    }
    return list;
  }, [currentFilter, favorites, ENABLE_BURGERS]);

  // (Estatísticas removidas a pedido do usuário)

  // scroll helper removido (não utilizado)

  const handleCustomizeClick = (product: Product) => {
    setCurrentCustomizationProduct(product);
    if (product.tags.includes('Esfirra')) {
      setIsEsfirraModalOpen(true);
    } else if (product.tags.includes('Porção')) {
      setIsPortionModalOpen(true);
    } else if (product.category === 'pizza') {
      setIsCustomizationModalOpen(true);
    } else {
      setIsCustomizationModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <header className="relative w-full overflow-hidden group min-h-[520px] md:h-[460px]">
        <Image src="/assets/bg.png" alt="Foto da Hamburgueria" fill priority className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[4000ms] ease-out" />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-[32rem] h-[32rem] bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center px-4 pt-16 md:pt-0 md:h-full md:justify-center">
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              {/* Bloco principal */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-white drop-shadow">Pizzaria Familia</span>
                </h1>
                <p className="text-white/80 mt-4 max-w-xl text-sm md:text-base leading-relaxed mx-auto md:mx-0">
                  Experimente combos artesanais, pizzas de vários sabores e bebidas geladas. Qual vai ser o pedido de hoje?
                </p>
                {/* CTAs removidos (Cardápio, Favoritos) e estatísticas conforme solicitação */}
              </div>

              {/* Card lateral com imagem e horário */}
              <div className="w-full md:w-80 flex flex-col gap-4">
                <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden shadow-2xl bg-transparent">
                  <Image src="/assets/logo nova.png?v=2" alt="Logo da Pizzaria" fill className="object-contain p-2 bg-transparent" priority />
                </div>
                <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl border border-white/40 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800 text-sm">Horário de Funcionamento</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isOpenNow ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{isOpenNow ? 'Aberto' : 'Fechado'}</span>
                  </div>
                  <p className="text-xs text-gray-600">Terça a Domingo <strong>18:00 - 23:00</strong></p>
                  <p className="text-xs text-gray-600 mt-1">
                    Rua porto velho N°140 - Alto do Sumaré · {" "}
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Rua%20porto%20velho%20140%20Alto%20do%20Sumar%C3%A9"
                      target="_blank"
                      rel="noreferrer"
                      className="underline text-emerald-700 hover:text-emerald-800"
                    >
                      Abrir no Maps
                    </a>
                  </p>
                  {/* Linhas de hora atual e agendamentos removidas conforme solicitação */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Wave decor bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden leading-[0]">
          <svg className="relative block w-[calc(100%+1.3px)] h-16 text-white" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M985.66 92.83C906.67 72 823.78 31 743.84 14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84 11.73-114 31.07-172 41.86A600.21 600.21 0 0 1 0 27.35V120h1200V95.8c-70.55 21.85-144.5 29.49-214.34-2.97Z" fill="currentColor" />
          </svg>
        </div>
      </header>

      <main id="menu" className="max-w-7xl mx-auto px-4 mt-6">
        {/* Promo Sexta-Feira (exibido somente às sextas) */}
        <PromoSextaCard />
        {isTueToThuPromo && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 text-green-800 p-3 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <span className="font-semibold">Promoção Terça a Quinta:</span> Pizzas tradicionais tamanho G por <span className="font-bold">R$ 35,00</span>.
              <span className="text-gray-600"> Válido apenas para sabores tradicionais. Extras e borda à parte.</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentFilter('pizzas')}>Ver Pizzas Tradicionais</Button>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 sticky top-0 z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 py-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
      {(
        (ENABLE_BURGERS
          ? (['all', 'favorites', 'burgers', 'drinks', 'massas', 'porcoes', 'pizzas', 'pizzas-especiais', 'pizzas-plus-especiais', 'pizzas-doces'] as FilterType[])
          : (['all', 'favorites', 'drinks', 'massas', 'porcoes', 'pizzas', 'pizzas-especiais', 'pizzas-plus-especiais', 'pizzas-doces'] as FilterType[])
        )
      ).map(ft => (
              <Button
                key={ft}
                size="sm"
                className={`px-4 h-10 text-[13px] md:px-3 md:h-8 md:text-[11px] font-medium rounded-full shadow-sm border ${currentFilter === ft ? 'bg-amber-500 text-white hover:bg-amber-500' : 'bg-white hover:bg-white/80'} transition-all data-[state=on]:shadow ${currentFilter === ft ? 'scale-[1.02]' : ''}`}
                variant={currentFilter === ft ? 'default' : 'outline'}
                onClick={() => setCurrentFilter(ft)}
              >
                {ft === 'all' && 'Todos'}
                {ft === 'favorites' && 'Favoritos'}
                {ft === 'burgers' && 'Lanches'}
                {ft === 'drinks' && 'Bebidas'}
                {ft === 'massas' && 'Lasanhas e Parmegianas'}
                {ft === 'porcoes' && 'Porções'}
                {ft === 'pizzas' && 'Pizzas Tradicionais'}
                {ft === 'pizzas-especiais' && 'Pizzas Especiais'}
                {ft === 'pizzas-plus-especiais' && 'Pizzas + Especiais'}
        {ft === 'pizzas-doces' && 'Pizzas Doces'}
              </Button>
            ))}
          </div>
          {/* Controles de busca/ordenação removidos */}
        </div>
        <Separator className="my-3" />

        {currentFilter !== 'pizzas-especiais' && currentFilter !== 'pizzas-plus-especiais' && currentFilter !== 'pizzas-doces' && (
          (currentFilter === 'burgers' && ENABLE_BURGERS) ? (
            <div className="space-y-10">
              {/* Lanches comuns */}
              <div>
                <h2 className="text-xl font-bold mb-4">Lanches</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts
                    .filter(p => !p.tags.includes('Artesanal') && !p.tags.includes('Trio') && !p.tags.includes('Tapioca') && !p.tags.includes('Cuscuz') && !p.tags.includes('Pastel') && !p.tags.includes('Esfirra'))
                    .sort((a, b) => {
                      const aPromo = a.tags.includes('Promoção') ? 1 : 0;
                      const bPromo = b.tags.includes('Promoção') ? 1 : 0;
                      if (aPromo !== bPromo) return bPromo - aPromo; // Promoção primeiro
                      return 0;
                    })
                    .map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
              {/* Tapiocas */}
              <div>
                <h2 className="text-xl font-bold mb-4">Tapiocas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Tapioca')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
              {/* Cuscuz */}
              <div>
                <h2 className="text-xl font-bold mb-4">Cuscuz</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Cuscuz')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
              {/* Pastéis */}
              <div>
                <h2 className="text-xl font-bold mb-4">Pastéis</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Pastel')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
              {/* Porções */}
              <div>
                <h2 className="text-xl font-bold mb-4">Porções</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Porção')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
              {/* Esfirras (um card) */}
              <div>
                <h2 className="text-xl font-bold mb-4">Esfirras</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Esfirra')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Toque em &quot;Personalizar&quot; para escolher: Doces (Chocolate, Dois amores) • Salgados (Calabresa, Calabresa c/ Catupiry, Frango Mussarela, Frango c/ Catupiry, Carne de Sol, Carne c/ Catupiry, Mista). Preço único R$ 8,00.</p>
              </div>
              {/* Artesanais */}
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Sanduíches Artesanais <span className="text-sm font-normal text-gray-500">(Burger Caseiro)</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Artesanal')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
              {/* Trios */}
              <div>
                <h2 className="text-xl font-bold mb-4">Trios</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Trio')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : currentFilter === 'drinks' ? (
            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-bold mb-4">Sucos Naturais</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Suco')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">Vitaminas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Vitamina')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4">Bebidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => !p.tags.includes('Suco') && !p.tags.includes('Vitamina')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : currentFilter === 'massas' ? (
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl font-bold mb-4">Lasanhas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Lasanha')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Parmegianas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.tags.includes('Parmegiana')).map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onCustomizeClick={handleCustomizeClick}
                      onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : currentFilter === 'porcoes' ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Porções</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProducts.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onCustomizeClick={handleCustomizeClick}
                    onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  
                  onCustomizeClick={handleCustomizeClick}
                  onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                />
              ))}
            </section>
          )
        )}

        {currentFilter === 'pizzas-especiais' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Pizzas Especiais</h2>
              <Button variant="outline" size="sm" onClick={() => setCurrentFilter('pizzas-plus-especiais')}>Ver Pizzas + Especiais</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  
                  onCustomizeClick={handleCustomizeClick}
                  onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                />
              ))}
            </div>
          </div>
        )}

        {currentFilter === 'pizzas-plus-especiais' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><span>Pizzas</span><span className="text-red-600 text-3xl leading-none">+</span><span>Especiais</span></h2>
              <Button variant="outline" size="sm" onClick={() => setCurrentFilter('pizzas-especiais')}>Ver Especiais</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  
                  onCustomizeClick={handleCustomizeClick}
                  onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                />
              ))}
            </div>
          </div>
        )}

        {currentFilter === 'pizzas-doces' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Pizzas Doces</h2>
              <Button variant="outline" size="sm" onClick={() => setCurrentFilter('pizzas')}>Ver Tradicionais</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onCustomizeClick={handleCustomizeClick}
                  onAddToCart={(name, price) => { addToCart(name, price); success('Adicionado!', `${name} foi adicionado ao carrinho`); }}
                />
              ))}
            </div>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
          </div>
        )}
      </main>

      {/* Botão flutuante do carrinho */}
      <button
        onClick={() => setIsCartModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-green-600/30 transition"
        aria-label="Abrir carrinho"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="hidden sm:inline">Carrinho ({getCartCount()})</span>
        <span className="sm:hidden text-sm">{getCartCount()}</span>
      </button>

      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />

      {currentCustomizationProduct && currentCustomizationProduct.category === 'burger' && (
        <CustomizationModal
          isOpen={isCustomizationModalOpen}
          onClose={() => { setIsCustomizationModalOpen(false); setCurrentCustomizationProduct(null); }}
          product={currentCustomizationProduct}
          onAddToCart={(customs, total) => {
            addToCart(currentCustomizationProduct.name, total);
            success('Adicionado!', 'Item personalizado adicionado ao carrinho');
            setIsCustomizationModalOpen(false);
            setCurrentCustomizationProduct(null);
          }}
        />
      )}
      {currentCustomizationProduct && currentCustomizationProduct.category === 'pizza' && (
        <PizzaCustomizationModal
          isOpen={isCustomizationModalOpen}
          onClose={() => { setIsCustomizationModalOpen(false); setCurrentCustomizationProduct(null); }}
          product={currentCustomizationProduct}
          onAddToCart={(name, total) => {
            addToCart(name, total);
            success('Pizza adicionada!', `${name} foi adicionada ao carrinho`);
            setIsCustomizationModalOpen(false);
            setCurrentCustomizationProduct(null);
          }}
        />
      )}

      {currentCustomizationProduct && currentCustomizationProduct.tags.includes('Esfirra') && (
        <EsfirraCustomizationModal
          isOpen={isEsfirraModalOpen}
          onClose={() => { setIsEsfirraModalOpen(false); setCurrentCustomizationProduct(null); }}
          product={currentCustomizationProduct}
          onAddToCart={(name, total) => {
            addToCart(name, total);
            success('Esfirra adicionada!', `${name} foi adicionada ao carrinho`);
            setIsEsfirraModalOpen(false);
            setCurrentCustomizationProduct(null);
          }}
        />
      )}

      {currentCustomizationProduct && currentCustomizationProduct.tags.includes('Porção') && (
        <PortionCustomizationModal
          isOpen={isPortionModalOpen}
          onClose={() => { setIsPortionModalOpen(false); setCurrentCustomizationProduct(null); }}
          product={currentCustomizationProduct}
          onAddToCart={(name, total) => {
            addToCart(name, total);
            success('Adicionado!', `${name} foi adicionado ao carrinho`);
            setIsPortionModalOpen(false);
            setCurrentCustomizationProduct(null);
          }}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
