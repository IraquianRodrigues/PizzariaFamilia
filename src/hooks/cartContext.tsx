"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Customization } from '../types';

export interface CartStats { totalItems: number; totalPrice: number; averagePrice: number; mostExpensiveItem: CartItem | null; cheapestItem: CartItem | null; }
export interface CartHistory { id: string; date: string; items: CartItem[]; total: number; status: 'completed' | 'cancelled'; }
interface CartContextValue { cart: CartItem[]; cartHistory: CartHistory[]; addToCart: (name: string, price: number, customizations?: Customization[]) => void; removeFromCart: (name: string) => void; updateQuantity: (name: string, quantity: number) => void; clearCart: () => void; checkout: () => void; cancelOrder: (orderId: string) => void; reorder: (orderId: string) => void; getCartTotal: () => number; getCartCount: () => number; getCartStats: () => CartStats; getSuggestions: () => string[]; isCartEmpty: () => boolean; getCartItems: () => CartItem[]; }
const CartContext = createContext<CartContextValue | null>(null);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartHistory, setCartHistory] = useState<CartHistory[]>([]);
  useEffect(() => { const savedCart = localStorage.getItem('pizzariaFamiliaCart'); const savedHistory = localStorage.getItem('pizzariaFamiliaCartHistory'); if (savedCart) setCart(JSON.parse(savedCart)); if (savedHistory) setCartHistory(JSON.parse(savedHistory)); }, []);
  const saveCartToStorage = useCallback((c: CartItem[]) => { localStorage.setItem('pizzariaFamiliaCart', JSON.stringify(c)); }, []);
  const saveHistoryToStorage = useCallback((h: CartHistory[]) => { localStorage.setItem('pizzariaFamiliaCartHistory', JSON.stringify(h)); }, []);
  const addToCart = useCallback((name: string, price: number, customizations?: Customization[]) => { setCart(prev => { const existing = prev.find(i => i.name === name); if (existing) { const updated = prev.map(i => i.name === name ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * i.price } : i); saveCartToStorage(updated); return updated; } const updated = [...prev, { name, price, quantity: 1, totalPrice: price, customizations: customizations || [] }]; saveCartToStorage(updated); return updated; }); }, [saveCartToStorage]);
  const removeFromCart = useCallback((name: string) => { setCart(prev => { const updated = prev.filter(i => i.name !== name); saveCartToStorage(updated); return updated; }); }, [saveCartToStorage]);
  const updateQuantity = useCallback((name: string, quantity: number) => { if (quantity <= 0) return removeFromCart(name); setCart(prev => { const updated = prev.map(i => i.name === name ? { ...i, quantity, totalPrice: quantity * i.price } : i); saveCartToStorage(updated); return updated; }); }, [removeFromCart, saveCartToStorage]);
  const clearCart = useCallback(() => { setCart([]); localStorage.removeItem('pizzariaFamiliaCart'); }, []);
  const getCartTotal = useCallback(() => cart.reduce((t, i) => t + i.totalPrice, 0), [cart]);
  const checkout = useCallback(() => { if (!cart.length) return; const order: CartHistory = { id: `order_${Date.now()}`, date: new Date().toISOString(), items: [...cart], total: getCartTotal(), status: 'completed' }; setCartHistory(prev => { const updated = [order, ...prev]; saveHistoryToStorage(updated); return updated; }); clearCart(); }, [cart, clearCart, getCartTotal, saveHistoryToStorage]);
  const cancelOrder = useCallback((orderId: string) => { setCartHistory(prev => { const updated = prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' as const } : o); saveHistoryToStorage(updated); return updated; }); }, [saveHistoryToStorage]);
  const reorder = useCallback((orderId: string) => { const order = cartHistory.find(o => o.id === orderId); if (order) { setCart(order.items); saveCartToStorage(order.items); } }, [cartHistory, saveCartToStorage]);
  const getCartStats = useCallback((): CartStats => { if (!cart.length) return { totalItems: 0, totalPrice: 0, averagePrice: 0, mostExpensiveItem: null, cheapestItem: null }; const totalItems = cart.reduce((s, i) => s + i.quantity, 0); const totalPrice = cart.reduce((s, i) => s + i.totalPrice, 0); const averagePrice = totalPrice / totalItems; const mostExpensiveItem = cart.reduce((m, i) => i.price > (m?.price || 0) ? i : m, null as CartItem | null); const cheapestItem = cart.reduce((m, i) => i.price < (m?.price || Infinity) ? i : m, null as CartItem | null); return { totalItems, totalPrice, averagePrice, mostExpensiveItem, cheapestItem }; }, [cart]);
  const getSuggestions = useCallback(() => { if (!cart.length) return []; const suggestions: string[] = []; if (cart.some(i => i.name.toLowerCase().includes('hambúrguer'))) suggestions.push('bebida'); if (cart.some(i => i.name.toLowerCase().includes('refri') || i.name.toLowerCase().includes('bebida'))) suggestions.push('hambúrguer'); return suggestions; }, [cart]);
  const getCartCount = useCallback(() => cart.reduce((c, i) => c + i.quantity, 0), [cart]);
  const isCartEmpty = useCallback(() => !cart.length, [cart]);
  const getCartItems = useCallback(() => cart, [cart]);
  const value: CartContextValue = { cart, cartHistory, addToCart, removeFromCart, updateQuantity, clearCart, checkout, cancelOrder, reorder, getCartTotal, getCartCount, getCartStats, getSuggestions, isCartEmpty, getCartItems };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>'); return ctx; }
