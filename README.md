# Pizzaria Família — Cardápio Digital

Aplicação web de cardápio digital para pizzaria e lanchonete, com carrinho, cálculo de taxa por bairro, checkout via WhatsApp e pagamento PIX. Construída com Next.js (App Router), React e Tailwind CSS.

## Visão Geral
- Catálogo de produtos (pizzas, lanches, bebidas) com preços e variações.
- Carrinho com ajustes de quantidade e subtotal por item.
- Seleção de tipo de entrega: Entrega ou Retirada (endereço exibido apenas em Entrega).
- Cálculo de taxa por bairro e total dinâmico.
- Checkout com mensagem formatada para WhatsApp (link `wa.me`).
- Pagamento via PIX com cópia rápida da chave e identificação do recebedor.
- Ícones e favicon gerados a partir da logo.


## Stack
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS + Radix UI
- Lucide Icons

## Requisitos
- Node.js 18+ (recomendado 20+)

## Primeiros Passos
1. Instale dependências:
```powershell
npm install
```
3. Inicie em desenvolvimento:
```powershell
npm run dev
```
4. Acesse http://localhost:3000

## Scripts
- `npm run dev`: Ambiente de desenvolvimento
- `npm run build`: Build de produção
- `npm run start`: Servir build
- `npm run gen:favicon`: Gerar favicon e ícones a partir da logo

## Estrutura de Pastas (resumo)
- `src/app`: App Router (layout, páginas e API routes)
- `src/components`: Componentes (CartModal, ProductCard, UI)
- `src/data`: Produtos e pizzas
- `public/assets`: Imagens públicas (logo, itens do cardápio)
- `scripts/generate-favicon.mjs`: Gerador de `favicon.ico` e ícones

## Configurações Importantes
- PIX
	- A chave exibida na UI é lida de `NEXT_PUBLIC_PIX_KEY`.
	- O nome do recebedor aparece logo abaixo da chave e vem de `NEXT_PUBLIC_PIX_NAME`.
- WhatsApp
	- O número usado para os links `wa.me` vem de `NEXT_PUBLIC_WHATSAPP_PHONE` (formato E.164 sem `+`, ex.: `5584998169843`).
- Tipo de Entrega
	- `Entrega`: exige endereço + bairro; inclui taxa no total.
	- `Retirada`: não exibe a seção de endereço e zera a taxa.

## Personalização Rápida
- Cores e tipografia: edite `tailwind.config.js` e `src/app/globals.css`.
- Bairros e taxas: em `src/components/CartModal.tsx` (array `neighborhoods`).
- Produtos: em `src/data/products.ts` e `src/data/pizzas.ts`.

## Deploy
1. Crie o build:
```powershell
npm run build
```
2. Publique os arquivos gerados pelo Next (`.next/`) com seu provedor (Vercel recomendado) e configure as mesmas variáveis de ambiente no painel do provedor.

## Boas Práticas e Notas
- As variáveis expostas no cliente devem usar o prefixo `NEXT_PUBLIC_`.
- Reinicie o servidor de desenvolvimento após alterar `.env`.
- Para gerar o favicon a partir da logo, coloque a logo em `public/assets/logo nova.png` (ou `logo.png/.jpeg`) e rode `npm run gen:favicon`.

## Créditos
Desenvolvido com ❤️ por Iraquian Rodrigues.

