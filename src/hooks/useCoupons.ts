'use client';

import { useState } from 'react';
import { Coupon } from '@/types';
import { coupons } from '@/data/products';

export function useCoupons() {
    const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
    const [discount, setDiscount] = useState(0);

    const applyCoupon = (couponCode: string, subtotal: number) => {
        const coupon = coupons[couponCode as keyof typeof coupons];

        if (!coupon) {
            return { success: false, message: 'Cupom inválido' };
        }

        // Verificar se o cupom pode ser aplicado
        if (coupon.oneTime && localStorage.getItem(`used_${couponCode}`)) {
            return { success: false, message: 'Este cupom já foi usado' };
        }

        if (coupon.minValue && subtotal < coupon.minValue) {
            return { success: false, message: `Pedido mínimo de R$ ${coupon.minValue.toFixed(2)}` };
        }

        // Aplicar cupom
        setActiveCoupon(coupon);

        // Marcar como usado se for de uso único
        if (coupon.oneTime) {
            localStorage.setItem(`used_${couponCode}`, 'true');
        }

        return { success: true, message: `Cupom aplicado: ${coupon.description}` };
    };

    const calculateDiscount = (cartItems: any[], subtotal: number) => {
        if (!activeCoupon) {
            setDiscount(0);
            return subtotal;
        }

        let applicableItems = [];

        if (activeCoupon.category === 'burgers') {
            applicableItems = cartItems.filter(item =>
                item.name.toLowerCase().includes('hamburguer')
            );
        } else if (activeCoupon.category === 'drinks') {
            applicableItems = cartItems.filter(item =>
                item.name.toLowerCase().includes('coca') ||
                item.name.toLowerCase().includes('guaraná')
            );
        } else {
            applicableItems = cartItems;
        }

        const applicableTotal = applicableItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        if (activeCoupon.type === 'percentage') {
            const newDiscount = (applicableTotal * activeCoupon.discount) / 100;
            setDiscount(newDiscount);
            return subtotal - newDiscount;
        }

        return subtotal;
    };

    const removeCoupon = () => {
        setActiveCoupon(null);
        setDiscount(0);
    };

    const getFinalTotal = (subtotal: number) => {
        return subtotal - discount;
    };

    return {
        activeCoupon,
        discount,
        applyCoupon,
        calculateDiscount,
        removeCoupon,
        getFinalTotal
    };
}

