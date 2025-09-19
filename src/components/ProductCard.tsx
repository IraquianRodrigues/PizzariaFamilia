'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types';
import { formatBRL } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Settings } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onCustomizeClick?: (product: Product) => void;
    onAddToCart: (name: string, price: number) => void;
    onShowToast?: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
}

export function ProductCard({ product, onCustomizeClick, onAddToCart, onShowToast }: ProductCardProps) {
    const { toggleFavorite, isFavorite } = useFavorites();
    const isTueToThu = (() => { const d = new Date().getDay(); return d >= 2 && d <= 4; })();
    const isTraditionalPizza = product.category === 'pizza' && !product.tags.includes('⭐ Especial') && !product.tags.includes('🔥 Plus') && !product.tags.includes('🍫 Doce');

    // Fallback para imagens ausentes (específico por categoria)
    const [imgSrc, setImgSrc] = useState(product.image);
    const fallbackImage =
        product.category === 'pizza'
            ? '/assets/logo.jpeg' // evita mostrar hambúrguer em pizza
            : product.category === 'drink'
            ? '/assets/refri-2.png'
            : '/assets/hamb-3.png';

    const handleAddToCart = () => {
        onAddToCart(product.name, product.price);

        // Mostrar notificação de sucesso
        if (onShowToast) {
            onShowToast('success', 'Produto adicionado!', `${product.name} foi adicionado ao carrinho`);
        }
    };

    const handleToggleFavorite = () => {
        toggleFavorite(product.name);
    };

    const handleCustomizeClick = () => {
        if (onCustomizeClick) {
            onCustomizeClick(product);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Imagem do produto - agora sem corte (object-contain + aspect ratio) */}
            <div className="relative group bg-gradient-to-br from-gray-50 to-gray-100 aspect-[16/9] sm:aspect-[4/3] flex items-center justify-center overflow-hidden">
                <Image
                    src={imgSrc}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 100vw"
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    priority={false}
                    onError={() => {
                        if (imgSrc !== fallbackImage) {
                            setImgSrc(fallbackImage);
                        }
                    }}
                />
                {/* Overlay com tags */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1 pointer-events-none">
                    {product.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-white/90 text-gray-700 border-0">
                            {tag}
                        </Badge>
                    ))}
                    {isTueToThu && isTraditionalPizza && (
                        <Badge variant="secondary" className="text-[10px] bg-green-600 text-white border-0">
                            Promo G R$ 35,00
                        </Badge>
                    )}
                </div>
                {/* Botão de favorito */}
                <button
                    aria-label={isFavorite(product.name) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    aria-pressed={isFavorite(product.name)}
                    onClick={handleToggleFavorite}
                    className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${isFavorite(product.name)
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-white/90 text-gray-400 hover:bg-red-500 hover:text-white'
                        }`}
                >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite(product.name) ? 'fill-current' : ''}`} />
                </button>
            </div>

            {/* Conteúdo do card */}
            <div className="p-4">
                {/* Nome e descrição */}
                <h3 className="font-bold text-base text-gray-800 mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">{product.description}</p>

                {/* Espaço reservado removido das avaliações */}

                {/* Preço e botões */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-left">
                        <p className="font-bold text-xl sm:text-2xl text-green-600">
                            {formatBRL(product.price)}
                        </p>
                    </div>

                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        {/* Botão de Personalização (apenas para pizzas) */}
                        {product.category === 'pizza' && onCustomizeClick && (
                            <Button
                                aria-label={`Personalizar ${product.name}`}
                                onClick={handleCustomizeClick}
                                variant="outline"
                                size="sm"
                                className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-colors text-[11px] px-2.5 sm:text-xs sm:px-3 py-1.5 whitespace-nowrap"
                            >
                                <Settings className="w-3.5 h-3.5 mr-1.5" />
                                Personalizar
                            </Button>
                        )}

                        {/* Botão de Adicionar ao Carrinho */}
                        <Button
                            aria-label={`Adicionar ${product.name} ao carrinho`}
                            onClick={handleAddToCart}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 text-xs px-3 py-1.5 whitespace-nowrap"
                            size="sm"
                        >
                            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                            Adicionar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
