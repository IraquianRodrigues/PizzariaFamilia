import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/hooks/cartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pizzaria Família - O melhor!",
  description: "Pizzas, lanches e bebidas artesanais.",
  openGraph: {
    type: "website",
    title: "Pizzaria Família",
    description: "Pizzas, lanches e bebidas artesanais.",
    images: ["/assets/hamb-1.png"],
    siteName: "Pizzaria Família",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <CartProvider>
          <div className="flex-1">
            {children}
          </div>
        </CartProvider>
        <footer className="border-t border-neutral-200/70 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs sm:text-sm text-neutral-500">
            <span>desenvolvido com ❤️ </span>
           
            <span>por </span>
            <span className="font-medium text-neutral-700">Iraquian Rodrigues</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
