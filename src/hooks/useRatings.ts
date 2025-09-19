'use client';

// Ratings feature disabled/stubbed to keep build clean.
export function useRatings() {
  return {
    productRatings: {} as Record<string, unknown[]>,
    addRating: (_productName: string, _rating: unknown) => {},
    getProductRating: (_productName: string) => ({ average: 0, count: 0 }),
    getRecentRatings: (_productName: string, _limit: number = 5) => [] as unknown[],
    clearRatings: () => {},
  } as const;
}

