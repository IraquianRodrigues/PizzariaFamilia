export type PizzaSize = 'pequena' | 'media' | 'grande' | 'extra_grande';

export interface Product {
    id: string;
    name: string;
    price: number; // preço base (para pizzas usar o menor tamanho)
    description: string;
    category: 'burger' | 'drink' | 'pizza';
    image: string;
    weight?: string;
    tags: string[];
    // Para pizzas: mapa de tamanhos -> preço
    prices?: Partial<Record<PizzaSize, number>>;
}

export interface CartItem {
    name: string;
    price: number;
    quantity: number;
    customizations?: Customization[];
    totalPrice: number;
}

// Coupon types removed (feature disabled)

// Ratings removed

export type FilterType = 'all' | 'favorites' | 'burgers' | 'drinks' | 'pizzas' | 'pizzas-especiais' | 'pizzas-plus-especiais' | 'pizzas-doces';
export type SortType = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

// NOVOS TIPOS PARA ADICIONAIS
export type AddonCategory = 'cheese' | 'protein' | 'vegetables' | 'sauces' | 'extras';

export interface Addon {
    id: string;
    name: string;
    price: number;
    category: AddonCategory;
    description: string;
    maxQuantity?: number;
    isAvailable: boolean;
}

export interface Customization {
    addonId: string;
    addonName: string;
    price: number;
    quantity: number;
}

export interface CustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    onAddToCart: (customizations: Customization[], totalPrice: number) => void;
}
