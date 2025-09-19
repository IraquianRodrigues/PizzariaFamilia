import { Product } from '@/types';

// Preços tradicionais
const basePrices = { pequena: 27.00, media: 30.00, grande: 38.00, extra_grande: 55.00 };
// Preços especiais
const specialBasePrices = { pequena: 29.00, media: 33.00, grande: 45.00, extra_grande: 60.00 };
// Preços + especiais (imagem referência: 35 / 45 / 60 / 70)
const plusSpecialBasePrices = { pequena: 35.00, media: 45.00, grande: 60.00, extra_grande: 70.00 };
// Preços pizzas doces (referência imagem: 30 / 35 / 45 / 55)
const sweetBasePrices = { pequena: 30.00, media: 35.00, grande: 45.00, extra_grande: 55.00 };

function pizza(id: string, name: string, description: string, tags: string[] = []): Product {
  const image = id === 'frango-mussarela'
    ? '/assets/frangomussarela.png'
    : id === 'calabresa'
      ? '/assets/calabresa.png'
      : id === 'portuguesa'
        ? '/assets/portuguesa.png'
      : id === 'calabresa-catupiry'
        ? '/assets/calabresa catupiry.png'
      : id === 'baiana'
        ? '/assets/baiana.png'
      : id === 'chocolate'
        ? '/assets/chocolate.png'
      : id === 'frango-catupiry'
        ? '/assets/frango catupiry.png'
      : id === 'mista'
        ? '/assets/mista.png'
      : id === 'espanhola'
        ? '/assets/espanhola.png'
      : id === 'lombo-canadense'
        ? '/assets/lombinho.png'
      : id === 'brasileira'
        ? '/assets/brasileira.png'
      : id === 'frango-supremo'
        ? '/assets/supremo.png'
      : id === 'francesa'
        ? '/assets/francesa.png'
      : id === 'mossoroense'
        ? '/assets/mossoro.png'
      : id === 'moda-do-chefe'
        ? '/assets/bacon.png'
      : id === 'carne-de-sol-mussarela'
        ? '/assets/carne mussarela.png'
      : id === 'carne-sol-mussarela'
        ? '/assets/carne mussarela.png'
      : id === 'carne-de-sol-catupiry'
        ? '/assets/carne catupiry.png'
      : id === 'carne-sol-catupiry'
        ? '/assets/carne catupiry.png'
      : id === 'bacon'
        ? '/assets/bacon.png'
      : `/assets/pizzas/${id}.jpg`;
  return { id, name, description, category: 'pizza', image, price: basePrices.pequena, prices: { ...basePrices }, tags: ['🍕 Pizza', ...tags] };
}
function pizzaSpecial(id: string, name: string, description: string): Product {
  const image = id === 'mussarela' ? '/assets/mussarela.png'
    : id === 'calabresa-especial' ? '/assets/especial.png'
    : id === 'lombo-canadense' ? '/assets/lombinho.png'
    : id === 'lombinho-especial' ? '/assets/lombo.png'
  : id === 'moda-do-chefe' ? '/assets/bacon.png'
    : id === 'brasileira' ? '/assets/brasileira.png'
    : id === 'frango-supremo' ? '/assets/supremo.png'
    : id === 'francesa' ? '/assets/francesa.png'
    : id === 'mossoroense' ? '/assets/mossoro.png'
    : id === 'bacon' ? '/assets/bacon.png'
    : id === 'carne-sol-mussarela' ? '/assets/carne mussarela.png'
    : id === 'carne-sol-catupiry' ? '/assets/carne catupiry.png'
    : id === 'lombinho' ? '/assets/lombinho.png'
    : id === '4-queijos' ? '/assets/4 queijos.png'
  : id === 'crocante' ? '/assets/crocante.png'
    : id === 'siliciana' ? '/assets/siciliana.png'
  : id === 'napolitana' ? '/assets/napolitana.png'
  : id === 'a-moda' ? '/assets/moda.png'
  : id === 'francheddar' ? '/assets/fran.png'
  : id === 'atum' ? '/assets/atum.png'
    : `/assets/pizzas/${id}.jpg`;
  return { id, name, description, category: 'pizza', image, price: specialBasePrices.pequena, prices: { ...specialBasePrices }, tags: ['🍕 Pizza', '⭐ Especial'] };
}
function pizzaPlusSpecial(id: string, name: string, description: string): Product {
  const image = id === 'file' ? '/assets/filee.png'
    : id === 'file-gorgonzola' ? '/assets/gorgozola.png'
    : id === 'peperone' ? '/assets/peperone.png'
    : id === 'camarao' ? '/assets/camarao.png'
    : id === 'camarao-especial' ? '/assets/camarao.png'
    : id === 'camarao-tibau' ? '/assets/camarao.png'
    : id === 'vegetariana' ? '/assets/supremo.png'
    : id === 'file-cheddar' ? '/assets/cheddar.png'
    : `/assets/pizzas/${id}.jpg`;
  return { id, name, description, category: 'pizza', image, price: plusSpecialBasePrices.pequena, prices: { ...plusSpecialBasePrices }, tags: ['🍕 Pizza', '⭐ Especial', '🔥 Plus'] };
}
function pizzaSweet(id: string, name: string, description: string): Product {
  const image = id === 'chocolate' ? '/assets/chocolate.png'
    : id === 'cartola' ? '/assets/cartola.png'
    : id === 'prestigio' ? '/assets/prestigio.png'
    : id === 'black-white' ? '/assets/black.png'
    : id === 'romeu-julieta' ? '/assets/romeu.png'
    : `/assets/pizzas/${id}.jpg`;
  return { id, name, description, category: 'pizza', image, price: sweetBasePrices.pequena, prices: { ...sweetBasePrices }, tags: ['🍕 Pizza', '🍫 Doce'] };
}

export const pizzas: Product[] = [
  pizza('frango-mussarela', 'Frango Mussarela', 'Molho de Tomate, Mussarela, Frango Desfiado e Orégano'),
  pizza('calabresa', 'Calabresa', 'Molho, Calabresa, Cebola, Mussarela, Azeitona e Orégano'),
  pizza('calabresa-catupiry', 'Calabresa Catupiry', 'Molho de Tomate, Calabresa, Mussarela, Catupiry e Orégano'),
  pizza('portuguesa', 'Portuguesa', 'Molho de Tomate, Ovos, Presunto, Mussarela, Ervilha e Orégano'),
  pizza('baiana', 'Baiana', 'Molho de Tomate, Mussarela, Calabresa Moída, Ovos, Cebola, Molho de Pimenta e Orégano'),
  pizza('chocolate', 'Chocolate', 'Creme de Leite, Chocolate e Disquete', ['Doce']),
  pizza('frango-catupiry', 'Frango Catupiry', 'Molho de Tomate, Mussarela, Frango Desfiado, Catupiry e Orégano'),
  pizza('mista', 'Mista', 'Molho de Tomate, Mussarela, Presunto e Orégano'),
  pizza('espanhola', 'Espanhola', 'Molho de Tomate, Mussarela, Calabresa Moída, Alho Frito e Orégano'),
];

export const specialPizzas: Product[] = [
  pizzaSpecial('calabresa-especial', 'Calabresa Especial', 'Molho de Tomate, Calabresa, Bacon, Mussarela, Champignon, Catupiry e Orégano'),
  pizzaSpecial('lombo-canadense', 'Lombo Canadense', 'Molho de Tomate, Lombo Canadense, Mussarela e Orégano'),
  pizzaSpecial('lombinho', 'Lombinho', 'Molho de Tomate, Lombo Canadense, Bacon, Mussarela, Catupiry, Azeitonas e Orégano'),
  pizzaSpecial('brasileira', 'Brasileira', 'Molho de Tomate, Atum, Ovo, Palmito e Mussarela'),
  pizzaSpecial('frango-supremo', 'Frango Supremo', 'Molho de Tomate, Frango, Creme de Leite, Presunto, Milho, Ervilha, Mussarela, Orégano e Azeitonas'),
  pizzaSpecial('francesa', 'Francesa', 'Molho de Tomate, Presunto, Ovo, Catupiry, Mussarela, Orégano e Azeitonas'),
  pizzaSpecial('atum', 'Atum', 'Molho de Tomate, Atum, Cebola, Mussarela, Orégano e Azeitonas'),
  pizzaSpecial('mossoroense', 'Mossoroense', 'Molho de Tomate, Calabresa, Milho, Palmito, Mussarela, Orégano e Azeitonas'),
  pizzaSpecial('moda-do-chefe', 'Moda do Chefe', 'Molho de Tomate, Mussarela, Bacon, Cheddar e Orégano'),
  pizzaSpecial('mussarela', 'Mussarela', 'Molho de Tomate, Mussarela, Azeitona e Orégano'),
  pizzaSpecial('bacon', 'Bacon', 'Molho de Tomate, Bacon, Mussarela, Azeitona e Orégano'),
  pizzaSpecial('carne-sol-mussarela', 'Carne de Sol Mussarela', 'Molho de Tomate, Carne de Sol, Mussarela e Orégano'),
  pizzaSpecial('carne-sol-catupiry', 'Carne de Sol Catupiry', 'Molho de Tomate, Carne de Sol Desfiada, Mussarela, Catupiry, Cebola e Orégano'),
  pizzaSpecial('4-queijos', '4 Queijos', 'Molho de Tomate, Mussarela, Catupiry, Gorgonzola, Provolone e Orégano'),
  pizzaSpecial('siliciana', 'Siliciana', 'Molho de Tomate, Bacon, Champignon, Mussarela e Orégano'),
  pizzaSpecial('crocante', 'Crocante', 'Molho de Tomate, Mussarela, Batata Palha, Tomate, Bacon, Ovo e Orégano'),
  pizzaSpecial('napolitana', 'Napolitana', 'Molho de Tomate, Mussarela, Presunto, Tomate, Bacon, Ovo e Orégano'),
  pizzaSpecial('a-moda', 'À Moda', 'Molho de Tomate, Mussarela, Palmito, Bacon, Calabresa e Orégano'),
  pizzaSpecial('francheddar', 'Francheddar', 'Molho de Tomate, Frango Desfiado, Mussarela, Cheddar e Orégano'),
];

export const plusSpecialPizzas: Product[] = [
  pizzaPlusSpecial('file', 'Filé', 'Molho de Tomate, Mussarela, Filé, Champignon, Azeitona e Orégano'),
  pizzaPlusSpecial('peperone', 'Peperone', 'Molho de Tomate, Mussarela, Peperone Picante, Champignon, Azeitona e Orégano'),
  pizzaPlusSpecial('file-gorgonzola', 'Filé Gorgonzola', 'Molho de Tomate, Mussarela, Filé, Queijo Gorgonzola, Champignon, Azeitona e Orégano'),
  pizzaPlusSpecial('camarao', 'Camarão', 'Molho de Tomate, Mussarela, Camarão, Alho, Cebola, Azeitona e Orégano'),
  pizzaPlusSpecial('camarao-especial', 'Camarão Especial', 'Molho de Tomate, Mussarela, Camarão, Manjericão, Alho Frito e Catupiry'),
  pizzaPlusSpecial('vegetariana', 'Vegetariana', 'Molho de Tomate, Palmito, Champignon, Milho, Ervilha, Tomate, Cebola, Pimentão, Azeitona e Orégano'),
  pizzaPlusSpecial('camarao-tibau', 'Camarão Tibau', 'Molho de Tomate, Mussarela, Camarão, Milho, Catupiry e Champignon'),
  pizzaPlusSpecial('file-cheddar', 'Filé Cheddar', 'Molho de Tomate, Mussarela, Filé, Cheddar, Champignon, Bacon e Orégano'),
];

// Pizzas doces
export const sweetPizzas: Product[] = [
  pizzaSweet('cartola', 'Cartola', 'Creme de Leite, Banana, Leite Condensado, Mussarela e Canela'),
  pizzaSweet('prestigio', 'Prestígio', 'Creme de Leite, Chocolate e Coco Ralado'),
  pizzaSweet('black-white', 'Black White', 'Creme de Leite, Chocolate Branco e Preto'),
  pizzaSweet('romeu-julieta', 'Romeu e Julieta', 'Creme de Leite, Goiabada e Mussarela'),
];

export interface PizzaExtra { id: string; name: string; price: number; type: 'extra' | 'borda'; }
// Restaurado conjunto completo (extras e bordas)
export const pizzaExtras: PizzaExtra[] = [
  { id: 'bacon', name: 'Bacon', price: 7, type: 'extra' },
  { id: 'calabresa', name: 'Calabresa', price: 9, type: 'extra' },
  { id: 'palmito', name: 'Palmito', price: 5, type: 'extra' },
  { id: 'frango', name: 'Frango', price: 9, type: 'extra' },
  { id: 'catupiry', name: 'Catupiry', price: 7, type: 'extra' },
  { id: 'mussarela', name: 'Mussarela', price: 10, type: 'extra' },
  { id: 'cheddar', name: 'Cheddar', price: 8, type: 'extra' },
  { id: 'creme-cheese-extra', name: 'Creme Cheese', price: 10, type: 'extra' },
  { id: 'creme-cheese-borda', name: 'Borda Creme Cheese', price: 10, type: 'borda' },
  { id: 'cheddar-borda', name: 'Borda Cheddar', price: 8, type: 'borda' },
  { id: 'chocolate-borda', name: 'Borda Chocolate', price: 8, type: 'borda' },
];

export const pizzaSizeSlices: Record<keyof typeof basePrices, number> = {
  pequena: 4,
  media: 6,
  grande: 8,
  extra_grande: 10,
};

export function calculatePizzaPrice(selectedIds: string[], size: keyof NonNullable<Product['prices']>, extras: PizzaExtra[]): number {
  
  const catalog = [...pizzas, ...specialPizzas, ...plusSpecialPizzas, ...sweetPizzas];
  
  const selected = catalog.filter(p => selectedIds.includes(p.id));
  
  if (selected.length === 0) return extras.reduce((acc, e) => acc + e.price, 0);
  
  let base = Math.max(...selected.map(p => p.prices?.[size] || 0));

  // Promoção: Terça a Quinta, pizzas tradicionais tamanho G por R$ 35,00
  // Aplica somente quando TODOS os sabores selecionados são tradicionais (não especiais/plus/doces)
  try {
    const day = new Date().getDay(); // 0=Dom,1=Seg,2=Ter,3=Qua,4=Qui,5=Sex,6=Sáb
    const isTueToThu = day >= 2 && day <= 4;
    const traditionalIds = new Set(pizzas.map(p => p.id));
    const allTraditional = selectedIds.length > 0 && selectedIds.every(id => traditionalIds.has(id));
    if (isTueToThu && size === 'grande' && allTraditional) {
      // Se o preço base para G é o tradicional (38), aplica 35
      if (base === basePrices.grande) {
        base = 35.0;
      }
    }
  } catch {}
  
  const extrasTotal = extras.reduce((acc, e) => acc + e.price, 0);
 
  return base + extrasTotal;
}
