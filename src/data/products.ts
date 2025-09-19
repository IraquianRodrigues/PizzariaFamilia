import { Product } from '@/types';
import { pizzas, specialPizzas, plusSpecialPizzas, sweetPizzas } from './pizzas';

export const products: Product[] = [
    // Lanches (substituindo hambúrgueres) – Obs.: Todos com Molho Especial, Tomate e Alface
    { id: 'completo', name: 'Completo', price: 10.00, description: 'Pão Bola, Hambúrguer, Presunto, Salsicha, Ovo e Queijo', category: 'burger', image: '/assets/hamb-1.png', tags: ['🥪 Lanche'] },
    { id: 'x-bacon-calabresa', name: 'X-Bacon Calabresa', price: 12.00, description: 'Pão Bola, Calabresa, Bacon, Presunto e Queijo', category: 'burger', image: '/assets/hamb-2.png', tags: ['🥪 Lanche'] },
    { id: 'x-calabresa', name: 'X-Calabresa', price: 10.00, description: 'Pão Bola, Calabresa, Presunto e Queijo', category: 'burger', image: '/assets/hamb-3.png', tags: ['🥪 Lanche'] },
    { id: 'calabresa-especial-lanche', name: 'Calabresa Especial', price: 15.00, description: 'Pão Bola, Calabresa, Presunto, Bacon, Ovo, Queijo e Catupiry', category: 'burger', image: '/assets/hamb-4.png', tags: ['🥪 Lanche', 'Especial'] },
    { id: 'frango-catupiry-lanche', name: 'Frango Catupiry', price: 13.00, description: 'Pão Bola, Frango e Catupiry', category: 'burger', image: '/assets/hamb-5.png', tags: ['🥪 Lanche', 'Frango'] },
    { id: 'x-frango', name: 'X-Frango', price: 13.00, description: 'Pão Bola, Frango, Presunto e Queijo', category: 'burger', image: '/assets/hamb-6.png', tags: ['🥪 Lanche', 'Frango'] },
    { id: 'x-bacon-frango', name: 'X-Bacon Frango', price: 15.00, description: 'Pão Bola, Frango, Bacon, Presunto e Queijo', category: 'burger', image: '/assets/hamb-7.png', tags: ['🥪 Lanche', 'Frango'] },
    { id: 'frango-especial', name: 'Frango Especial', price: 18.00, description: 'Pão Bola, Frango, Queijo, Presunto, Ovos e Bacon', category: 'burger', image: '/assets/hamb-8.png', tags: ['🥪 Lanche', 'Especial'] },
    { id: 'misto-quente', name: 'Misto Quente', price: 7.50, description: 'Pão Bola, Presunto e Queijo', category: 'burger', image: '/assets/hamb-1.png', tags: ['🥪 Lanche'] },
    { id: 'bauru', name: 'Bauru', price: 7.50, description: 'Pão Bola, Ovos, Presunto, Queijo, Tomate e Orégano', category: 'burger', image: '/assets/hamb-2.png', tags: ['🥪 Lanche'] },
    { id: 'americano', name: 'Americano', price: 13.00, description: 'Pão Bola, Queijo Duplo, Presunto Duplo, Bacon e Ovos', category: 'burger', image: '/assets/hamb-3.png', tags: ['🥪 Lanche'] },
    { id: 'dog-especial', name: 'Dog Especial', price: 14.00, description: 'Pão Bola, Salsicha, Queijo, Presunto, Ovos e Bacon', category: 'burger', image: '/assets/hamb-4.png', tags: ['🥪 Lanche', 'Hot Dog'] },
    { id: 'caseiro-duplo-especial', name: 'Caseiro Duplo Especial', price: 22.00, description: 'Pão Bola, 2 Hambúrguer Caseiro 130g, Queijo Duplo, Presunto Duplo e Ovo', category: 'burger', image: '/assets/hamb-5.png', tags: ['🥪 Lanche', 'Especial'] },
    { id: 'x-tudo', name: 'X-Tudo', price: 22.00, description: 'Pão Bola, Ovos, Presunto, Queijo, Hambúrguer, Frango, Lombo, Calabresa, Filé, Salsicha e Bacon', category: 'burger', image: '/assets/hamb-6.png', tags: ['🥪 Lanche', 'Completo'] },
    { id: 'completo-caseiro', name: 'Completo Caseiro', price: 15.00, description: 'Pão Bola, Hambúrguer Caseiro 130g, Presunto, Queijo e Ovo', category: 'burger', image: '/assets/hamb-7.png', tags: ['🥪 Lanche'] },
    { id: 'x-lombo', name: 'X-Lombo', price: 16.00, description: 'Pão Bola, Lombo Bovino e Queijo', category: 'burger', image: '/assets/hamb-8.png', tags: ['🥪 Lanche'] },
    { id: 'cachorro-quente', name: 'Cachorro Quente', price: 9.00, description: 'Carne Moída, Salsicha, Salada, Milho e Molho Parmesão', category: 'burger', image: '/assets/dog.jpg', tags: ['🥪 Lanche', 'Hot Dog'] },
    // Lanches adicionais (segunda imagem)
    { id: 'x-bacon-lombo', name: 'X-Bacon Lombo', price: 17.00, description: 'Pão Bola, Lombo Bovino, Bacon e Queijo', category: 'burger', image: '/assets/hamb-2.png', tags: ['🥪 Lanche', 'Lombo'] },
    { id: 'lombo-especial', name: 'Lombo Especial', price: 22.00, description: 'Pão Bola, Lombo Bovino, Queijo, Bacon, Presunto e Ovos', category: 'burger', image: '/assets/hamb-3.png', tags: ['🥪 Lanche', 'Lombo', 'Especial'] },
    { id: 'x-file', name: 'X-Filé', price: 21.00, description: 'Pão Bola, Presunto, Filé e Queijo', category: 'burger', image: '/assets/hamb-4.png', tags: ['🥪 Lanche', 'Filé'] },
    { id: 'x-bacon-file', name: 'X-Bacon Filé', price: 22.00, description: 'Pão Bola, Filé, Presunto, Bacon e Queijo', category: 'burger', image: '/assets/hamb-5.png', tags: ['🥪 Lanche', 'Filé'] },
    { id: 'completo-file', name: 'Completo Filé', price: 22.00, description: 'Pão Bola, Filé, Presunto, Ovos e Queijo', category: 'burger', image: '/assets/hamb-6.png', tags: ['🥪 Lanche', 'Filé'] },
    { id: 'file-especial', name: 'Filé Especial', price: 23.00, description: 'Pão Bola, Filé Mignon, Frango Desfiado, Queijo, Presunto, Ovos e Bacon', category: 'burger', image: '/assets/hamb-7.png', tags: ['🥪 Lanche', 'Filé', 'Especial'] },
    { id: 'x-bacon-burg', name: 'X-Bacon Burg', price: 10.00, description: 'Pão Bola, Queijo, Bacon e Hambúrguer Bovino', category: 'burger', image: '/assets/hamb-8.png', tags: ['🥪 Lanche'] },
    // Sanduíches Artesanais
    { id: 'du-cheff-express', name: 'Du Cheff Express', price: 23.00, description: 'Pão Brioche, 2 Burger Caseiro 130g, Cheddar, Queijo Coalho, Bacon, Cebola Caramelizada, Salada e Molho da Casa', category: 'burger', image: '/assets/hamb-7.png', tags: ['🥪 Lanche', 'Artesanal'] },
    { id: 'dupluchesse', name: 'DuPluChesse', price: 23.00, description: 'Pão Brioche, 2 Burger Caseiro 130g, Cheddar Duplo, Creme Cheese, Salada e Molho da Casa', category: 'burger', image: '/assets/hamb-8.png', tags: ['🥪 Lanche', 'Artesanal'] },
    // Trios
    { id: 'trio-01', name: 'Trio 01', price: 22.00, description: 'Completo Burg, Batata Frita e Refrigerante Lata', category: 'burger', image: '/assets/Gemini_Generated_Image_5565nf5565nf5565.png', tags: ['🥪 Lanche', 'Trio'] },
    { id: 'trio-02', name: 'Trio 02', price: 25.00, description: 'Completo Frango, Batata Frita e Refrigerante Lata', category: 'burger', image: '/assets/trio 2.png', tags: ['🥪 Lanche', 'Trio'] },
    { id: 'trio-03', name: 'Trio 03', price: 29.00, description: 'Completo Filé, Batata Frita e Refrigerante Lata', category: 'burger', image: '/assets/Gemini_Generated_Image_s1kb0os1kb0os1kb.png', tags: ['🥪 Lanche', 'Trio'] },
    {
        id: 'coca',
        name: 'Coca-Cola Lata',
        price: 6.50,
        description: 'Refrigerante Coca-Cola em lata 350ml.',
        category: 'drink',
        image: '/assets/refri-1.png',
        tags: ['🥤 Bebida', '350ml']
    },
    {
        id: 'guarana',
        name: 'Guaraná Lata',
        price: 6.00,
        description: 'Refrigerante Guaraná em lata 350ml.',
        category: 'drink',
        image: '/assets/refri-2.png',
        tags: ['🥤 Bebida', '350ml']
    },
    // Sucos (naturais) e Vitaminas (mesmos sabores com preço adicional)
    // Padrão observado: Vitamina = Suco + 2,00
    // Maracujá
    { id: 'suco-maracuja', name: 'Suco Maracujá', price: 10.00, description: 'Suco natural de maracujá (água ou leite)', category: 'drink', image: '/assets/maracuja.jpg', tags: ['🥤 Bebida', 'Suco'] },
    { id: 'vitamina-maracuja', name: 'Vitamina Maracujá', price: 12.00, description: 'Vitamina de maracujá batida com leite', category: 'drink', image: '/assets/maracuja.jpg', tags: ['🥤 Bebida', 'Vitamina'] },
    // Acerola
    { id: 'suco-acerola', name: 'Suco Acerola', price: 8.00, description: 'Suco natural de acerola', category: 'drink', image: '/assets/acerola.png', tags: ['🥤 Bebida', 'Suco'] },
    { id: 'vitamina-acerola', name: 'Vitamina Acerola', price: 10.00, description: 'Vitamina de acerola com leite', category: 'drink', image: '/assets/acerola.png', tags: ['🥤 Bebida', 'Vitamina'] },
    // Morango
    { id: 'suco-morango', name: 'Suco Morango', price: 10.00, description: 'Suco natural de morango', category: 'drink', image: '/assets/morango.png', tags: ['🥤 Bebida', 'Suco'] },
    { id: 'vitamina-morango', name: 'Vitamina Morango', price: 12.00, description: 'Vitamina de morango com leite', category: 'drink', image: '/assets/morango.png', tags: ['🥤 Bebida', 'Vitamina'] },
    // Uva
    { id: 'suco-uva', name: 'Suco Uva', price: 10.00, description: 'Suco natural de uva', category: 'drink', image: '/assets/uva.png', tags: ['🥤 Bebida', 'Suco'] },
    { id: 'vitamina-uva', name: 'Vitamina Uva', price: 12.00, description: 'Vitamina de uva com leite', category: 'drink', image: '/assets/uva.png', tags: ['🥤 Bebida', 'Vitamina'] },
    // Goiaba
    { id: 'suco-goiaba', name: 'Suco Goiaba', price: 8.00, description: 'Suco natural de goiaba', category: 'drink', image: '/assets/goiaba.png', tags: ['🥤 Bebida', 'Suco'] },
    { id: 'vitamina-goiaba', name: 'Vitamina Goiaba', price: 10.00, description: 'Vitamina de goiaba com leite', category: 'drink', image: '/assets/goiaba.png', tags: ['🥤 Bebida', 'Vitamina'] },
    // Cajá
    { id: 'suco-caja', name: 'Suco Cajá', price: 7.00, description: 'Suco natural de cajá', category: 'drink', image: '/assets/caja.png', tags: ['🥤 Bebida', 'Suco'] },
    { id: 'vitamina-caja', name: 'Vitamina Cajá', price: 9.00, description: 'Vitamina de cajá com leite', category: 'drink', image: '/assets/caja.png', tags: ['🥤 Bebida', 'Vitamina'] },
    // Abacaxi
    { id: 'suco-abacaxi', name: 'Suco Abacaxi', price: 7.00, description: 'Suco natural de abacaxi', category: 'drink', image: '/assets/abacaxi.png', tags: ['🥤 Bebida', 'Suco'] },
    { id: 'vitamina-abacaxi', name: 'Vitamina Abacaxi', price: 9.00, description: 'Vitamina de abacaxi com leite', category: 'drink', image: '/assets/abacaxi.png', tags: ['🥤 Bebida', 'Vitamina'] },
    // Graviola
    { id: 'suco-graviola', name: 'Suco Graviola', price: 8.00, description: 'Suco natural de graviola', category: 'drink', image: '/assets/graviola.png', tags: ['🥤 Bebida', 'Suco'] },
    { id: 'vitamina-graviola', name: 'Vitamina Graviola', price: 10.00, description: 'Vitamina de graviola com leite', category: 'drink', image: '/assets/graviola.png', tags: ['🥤 Bebida', 'Vitamina'] },
    // Caju
    { id: 'suco-caju', name: 'Suco Caju', price: 7.00, description: 'Suco natural de caju', category: 'drink', image: '/assets/caju.png', tags: ['🥤 Bebida', 'Suco'] },
    { id: 'vitamina-caju', name: 'Vitamina Caju', price: 9.00, description: 'Vitamina de caju com leite', category: 'drink', image: '/assets/caju.png', tags: ['🥤 Bebida', 'Vitamina'] },
    // Manga
    { id: 'suco-manga', name: 'Suco Manga', price: 7.00, description: 'Suco natural de manga', category: 'drink', image: '/assets/manga.png', tags: ['🥤 Bebida', 'Suco'] },
    { id: 'vitamina-manga', name: 'Vitamina Manga', price: 9.00, description: 'Vitamina de manga com leite', category: 'drink', image: '/assets/manga.png', tags: ['🥤 Bebida', 'Vitamina'] },
    // Demais bebidas
    { id: 'guarana-1l', name: 'Guaraná 1L', price: 10.00, description: 'Garrafa de Guaraná 1 Litro', category: 'drink', image: '/assets/guaranaa.png', tags: ['🥤 Bebida', 'Refrigerante'] },
    { id: 'pepsi-1l', name: 'Pepsi 1L', price: 10.00, description: 'Garrafa de Pepsi 1 Litro', category: 'drink', image: '/assets/pepsi.png', tags: ['🥤 Bebida', 'Refrigerante'] },
    { id: 'coca-1l', name: 'Coca Cola 1L', price: 10.00, description: 'Garrafa de Coca Cola 1 Litro', category: 'drink', image: '/assets/coca.png', tags: ['🥤 Bebida', 'Refrigerante'] },
    { id: 'coca-zero-1l', name: 'Coca Cola Zero 1L', price: 10.00, description: 'Garrafa de Coca Cola Zero 1 Litro', category: 'drink', image: '/assets/zero.png', tags: ['🥤 Bebida', 'Refrigerante'] },
    { id: 'cajuina-1l', name: 'Cajuina 1L', price: 10.00, description: 'Garrafa de Cajuina 1 Litro', category: 'drink', image: '/assets/cajuina.png', tags: ['🥤 Bebida', 'Refrigerante'] },
    { id: 'h2oh-limoneto', name: 'H2OH Limoneto', price: 7.00, description: 'Bebida H2OH sabor limão', category: 'drink', image: '/assets/h20.png', tags: ['🥤 Bebida'] },
    { id: 'agua-gas', name: 'Água Mineral com Gás', price: 3.50, description: 'Água mineral gaseificada', category: 'drink', image: '/assets/gas.jpg', tags: ['🥤 Bebida', 'Água'] },
    { id: 'agua-500', name: 'Água Mineral 500ml', price: 2.50, description: 'Garrafa de água mineral 500ml', category: 'drink', image: '/assets/mineral.jpg', tags: ['🥤 Bebida', 'Água'] },
    // pizzas tradicionais e especiais
    ...pizzas,
    ...specialPizzas,
    ...plusSpecialPizzas,
    ...sweetPizzas
];

export const coupons = {
    'BURGER10': {
        name: 'BURGER10',
        discount: 10,
        type: 'percentage' as const,
        category: 'burgers' as const,
        description: '10% de desconto em hambúrgueres'
    },
    'DRINK15': {
        name: 'DRINK15',
        discount: 15,
        type: 'percentage' as const,
        category: 'drinks' as const,
        description: '15% de desconto em bebidas'
    },
    'PRIMEIRA10': {
        name: 'PRIMEIRA10',
        discount: 10,
        type: 'percentage' as const,
        category: 'all' as const,
        description: '10% de desconto na primeira compra',
        oneTime: true
    },
    'PROMO20': {
        name: 'PROMO20',
        discount: 20,
        type: 'percentage' as const,
        category: 'all' as const,
        description: '20% de desconto em pedidos acima de R$ 50,00',
        minValue: 50
    }
};

