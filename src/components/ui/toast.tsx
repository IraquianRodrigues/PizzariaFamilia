'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const toastIcons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
};

const toastColors = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-blue-500 border-blue-600',
    warning: 'bg-yellow-500 border-yellow-600',
};

export function Toast({ toast, onRemove }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onRemove(toast.id), 300);
        }, toast.duration || 4000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    const Icon = toastIcons[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`relative flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 ${toastColors[toast.type]} text-white min-w-[320px] max-w-[400px]`}
        >
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{toast.title}</h4>
                {toast.message && (
                    <p className="text-sm opacity-90 mt-1">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onRemove(toast.id), 300);
                }}
                className="p-1 hover:bg-white/20 rounded transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

export function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-3">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onRemove={onRemove} />
                ))}
            </AnimatePresence>
        </div>
    );
}



