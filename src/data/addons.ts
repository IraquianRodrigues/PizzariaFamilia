import { Addon } from '@/types';

export const addons: Addon[] = [
    // 🧀 QUEIJOS
    {
        id: 'cheddar',
        name: 'Cheddar',
        price: 3.50,
        category: 'cheese',
        description: 'Queijo cheddar derretido e cremoso',
        maxQuantity: 1,
        isAvailable: true
    },
    {
        id: 'gorgonzola',
        name: 'Gorgonzola',
        price: 4.50,
        category: 'cheese',
        description: 'Queijo azul com sabor intenso',
        maxQuantity: 1,
        isAvailable: true
    },
    {
        id: 'provolone',
        name: 'Provolone',
        price: 3.00,
        category: 'cheese',
        description: 'Queijo suave e cremoso',
        maxQuantity: 1,
        isAvailable: true
    },
    {
        id: 'coalho',
        name: 'Queijo Coalho',
        price: 3.50,
        category: 'cheese',
        description: 'Queijo brasileiro tradicional',
        maxQuantity: 1,
        isAvailable: true
    },
    {
        id: 'mozzarella',
        name: 'Mozzarella',
        price: 2.50,
        category: 'cheese',
        description: 'Queijo derretido e elástico',
        maxQuantity: 1,
        isAvailable: true
    },

    // 🥓 PROTEÍNAS
    {
        id: 'bacon',
        name: 'Bacon',
        price: 4.00,
        category: 'protein',
        description: 'Bacon crocante e defumado',
        maxQuantity: 2,
        isAvailable: true
    },
    {
        id: 'frango',
        name: 'Frango Grelhado',
        price: 5.00,
        category: 'protein',
        description: 'Peito de frango desfiado grelhado',
        maxQuantity: 2,
        isAvailable: true
    },
    {
        id: 'ovo',
        name: 'Ovo Frito',
        price: 2.00,
        category: 'protein',
        description: 'Ovo frito com gema mole',
        maxQuantity: 2,
        isAvailable: true
    },
    {
        id: 'carne-seca',
        name: 'Carne Seca',
        price: 6.00,
        category: 'protein',
        description: 'Carne seca brasileira desfiada',
        maxQuantity: 2,
        isAvailable: true
    },
    {
        id: 'pepperoni',
        name: 'Pepperoni',
        price: 4.50,
        category: 'protein',
        description: 'Salame picante italiano',
        maxQuantity: 2,
        isAvailable: true
    },

    // 🥬 VEGETAIS
    {
        id: 'alface',
        name: 'Alface Americana',
        price: 1.00,
        category: 'vegetables',
        description: 'Alface crocante e fresca',
        isAvailable: true
    },
    {
        id: 'tomate',
        name: 'Tomate',
        price: 1.00,
        category: 'vegetables',
        description: 'Tomate fresco e suculento',
        isAvailable: true
    },
    {
        id: 'cebola-roxa',
        name: 'Cebola Roxa',
        price: 1.00,
        category: 'vegetables',
        description: 'Cebola roxa crua e crocante',
        isAvailable: true
    },
    {
        id: 'cebola-caramelizada',
        name: 'Cebola Caramelizada',
        price: 2.50,
        category: 'vegetables',
        description: 'Cebola caramelizada e doce',
        isAvailable: true
    },
    {
        id: 'picles',
        name: 'Picles',
        price: 1.50,
        category: 'vegetables',
        description: 'Picles ácidos e crocantes',
        isAvailable: true
    },
    {
        id: 'rucula',
        name: 'Rúcula',
        price: 1.50,
        category: 'vegetables',
        description: 'Rúcula fresca e amarga',
        isAvailable: true
    },
    {
        id: 'cogumelos',
        name: 'Cogumelos',
        price: 3.00,
        category: 'vegetables',
        description: 'Cogumelos grelhados',
        isAvailable: true
    },

    // 🥫 MOLHOS ESPECIAIS
    {
        id: 'maionese-casa',
        name: 'Maionese da Casa',
        price: 1.50,
        category: 'sauces',
        description: 'Maionese cremosa e especial',
        isAvailable: true
    },
    {
        id: 'barbecue',
        name: 'Molho Barbecue',
        price: 2.00,
        category: 'sauces',
        description: 'Molho barbecue defumado',
        isAvailable: true
    },
    {
        id: 'ranch',
        name: 'Molho Ranch',
        price: 2.00,
        category: 'sauces',
        description: 'Molho ranch cremoso',
        isAvailable: true
    },
    {
        id: 'chipotle',
        name: 'Molho Chipotle',
        price: 2.50,
        category: 'sauces',
        description: 'Molho chipotle picante',
        isAvailable: true
    },
    {
        id: 'ervas',
        name: 'Molho de Ervas',
        price: 2.00,
        category: 'sauces',
        description: 'Molho fresco de ervas',
        isAvailable: true
    },

    // 🍟 EXTRAS ESPECIAIS
    {
        id: 'batata-palha',
        name: 'Batata Palha',
        price: 2.00,
        category: 'extras',
        description: 'Batata palha crocante',
        isAvailable: true
    },
    {
        id: 'cebola-crispy',
        name: 'Cebola Crispy',
        price: 2.50,
        category: 'extras',
        description: 'Cebola frita crocante',
        isAvailable: true
    },
    {
        id: 'aneis-cebola',
        name: 'Anéis de Cebola',
        price: 3.00,
        category: 'extras',
        description: 'Anéis de cebola empanados',
        isAvailable: true
    },
    {
        id: 'queijo-ralado',
        name: 'Queijo Ralado',
        price: 1.50,
        category: 'extras',
        description: 'Parmesão ralado',
        isAvailable: true
    },
    {
        id: 'jalapeno',
        name: 'Pimenta Jalapeño',
        price: 2.00,
        category: 'extras',
        description: 'Pimenta jalapeño fresca',
        isAvailable: true
    }
];

// Função para obter adicionais por categoria
export const getAddonsByCategory = (category: string) => {
    return addons.filter(addon => addon.category === category);
};

// Função para calcular desconto baseado na quantidade de adicionais
export const calculateAddonDiscount = (addonCount: number): number => {
    if (addonCount >= 5) return 0.20; // 20% de desconto
    if (addonCount >= 3) return 0.15; // 15% de desconto
    if (addonCount >= 1) return 0.10; // 10% de desconto
    return 0;
};

// Categorias disponíveis
export const addonCategories = [
    { id: 'cheese', name: '🧀 Queijos', icon: '🧀' },
    { id: 'protein', name: '🥓 Proteínas', icon: '🥓' },
    { id: 'vegetables', name: '🥬 Vegetais', icon: '🥬' },
    { id: 'sauces', name: '🥫 Molhos', icon: '🥫' },
    { id: 'extras', name: '🍟 Extras', icon: '🍟' }
];






