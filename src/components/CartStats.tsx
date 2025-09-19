'use client';

import { motion } from 'framer-motion';
import { CartStats as CartStatsType } from '@/hooks/cartContext';
import { TrendingUp, Package, DollarSign, Clock } from 'lucide-react';

interface CartStatsProps {
    stats: CartStatsType;
    isVisible: boolean;
}

export function CartStats({ stats, isVisible }: CartStatsProps) {
    if (!isVisible || stats.totalItems === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6"
        >
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Estatísticas do Carrinho
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">Total de Itens</p>
                    <p className="text-xl font-bold text-blue-600">{stats.totalItems}</p>
                </div>

                <div className="text-center">
                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">Valor Total</p>
                    <p className="text-xl font-bold text-green-600">
                        R$ {stats.totalPrice.toFixed(2).replace('.', ',')}
                    </p>
                </div>

                <div className="text-center">
                    <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600">Preço Médio</p>
                    <p className="text-xl font-bold text-purple-600">
                        R$ {stats.averagePrice.toFixed(2).replace('.', ',')}
                    </p>
                </div>

                <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-sm text-gray-600">Item Mais Caro</p>
                    <p className="text-sm font-semibold text-orange-600 truncate">
                        {stats.mostExpensiveItem?.name || 'N/A'}
                    </p>
                </div>
            </div>

            {stats.mostExpensiveItem && stats.cheapestItem && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700 text-center">
                        <span className="font-semibold">Dica:</span> Você pode economizar
                        <span className="font-bold text-green-600 mx-1">
                            R$ {(stats.mostExpensiveItem.price - stats.cheapestItem.price).toFixed(2).replace('.', ',')}
                        </span>
                        escolhendo o item mais barato!
                    </p>
                </div>
            )}
        </motion.div>
    );
}



