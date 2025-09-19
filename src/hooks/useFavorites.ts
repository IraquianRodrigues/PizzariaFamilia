'use client';

import { useState, useEffect } from 'react';

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const savedFavorites = localStorage.getItem('pizzariaFamiliaFavorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
        const sync = () => {
            try {
                const latest = localStorage.getItem('pizzariaFamiliaFavorites');
                // Defer update to avoid setState during another component's render
                setTimeout(() => {
                    try {
                        setFavorites(latest ? JSON.parse(latest) : []);
                    } catch {}
                }, 0);
            } catch {}
        };
        const onStorage = (e: StorageEvent) => {
            if (e.key === 'pizzariaFamiliaFavorites') sync();
        };
        const onCustom = () => sync();
        window.addEventListener('storage', onStorage);
        window.addEventListener('pizzaria:favorites-updated', onCustom as EventListener);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('pizzaria:favorites-updated', onCustom as EventListener);
        };
    }, []);

    const saveFavoritesToStorage = (newFavorites: string[]) => {
        localStorage.setItem('pizzariaFamiliaFavorites', JSON.stringify(newFavorites));
        try {
            window.dispatchEvent(new Event('pizzaria:favorites-updated'));
        } catch {}
    };

    const toggleFavorite = (name: string) => {
        setFavorites(prevFavorites => {
            const index = prevFavorites.indexOf(name);
            let newFavorites: string[];

            if (index === -1) {
                newFavorites = [...prevFavorites, name];
            } else {
                newFavorites = prevFavorites.filter(fav => fav !== name);
            }

            saveFavoritesToStorage(newFavorites);
            return newFavorites;
        });
    };

    const isFavorite = (name: string) => {
        return favorites.includes(name);
    };

    const clearFavorites = () => {
        setFavorites([]);
        localStorage.removeItem('pizzariaFamiliaFavorites');
        try {
            window.dispatchEvent(new Event('pizzaria:favorites-updated'));
        } catch {}
    };

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites
    };
}

