'use client';

import { useState, useEffect } from 'react';
import { Rating, ProductRatings } from '@/types';

export function useRatings() {
    const [productRatings, setProductRatings] = useState<ProductRatings>({});

    useEffect(() => {
    const savedRatings = localStorage.getItem('pizzariaFamiliaRatings');
        if (savedRatings) {
            setProductRatings(JSON.parse(savedRatings));
        }
    }, []);

    const saveRatingsToStorage = (newRatings: ProductRatings) => {
    localStorage.setItem('pizzariaFamiliaRatings', JSON.stringify(newRatings));
    };

    const addRating = (productName: string, rating: Omit<Rating, 'date' | 'time'>) => {
        const newRating: Rating = {
            ...rating,
            date: new Date().toLocaleDateString('pt-BR'),
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        setProductRatings(prev => {
            const newRatings = {
                ...prev,
                [productName]: [...(prev[productName] || []), newRating]
            };
            saveRatingsToStorage(newRatings);
            return newRatings;
        });
    };

    const getProductRating = (productName: string) => {
        const ratings = productRatings[productName] || [];
        if (ratings.length === 0) return { average: 0, count: 0 };

        const total = ratings.reduce((sum, rating) => sum + rating.stars, 0);
        const average = total / ratings.length;

        return { average, count: ratings.length };
    };

    const getRecentRatings = (productName: string, limit: number = 5) => {
        const ratings = productRatings[productName] || [];
        return ratings.slice(-limit).reverse();
    };

    const clearRatings = () => {
        setProductRatings({});
    localStorage.removeItem('pizzariaFamiliaRatings');
    };

    return {
        productRatings,
        addRating,
        getProductRating,
        getRecentRatings,
        clearRatings
    };
}

