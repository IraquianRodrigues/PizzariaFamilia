'use client';

// Coupons feature disabled for pizzaria project.
// This hook is intentionally stubbed to avoid build errors and keep imports safe.
export function useCoupons() {
  return {
    activeCoupon: null,
    discount: 0,
    applyCoupon: () => ({ success: false, message: 'Cupom desativado' }),
    calculateDiscount: (_items: ReadonlyArray<unknown>, subtotal: number) => subtotal,
    removeCoupon: () => {},
    getFinalTotal: (subtotal: number) => subtotal,
  } as const;
}

