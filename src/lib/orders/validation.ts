import { z } from 'zod';

export const orderItemSchema = z.object({
  productName: z.string().min(1),
  basePrice: z.number().positive(),
  quantity: z.number().int().min(1).default(1),
  category: z.string().optional(),
  // pizzaConfigRef: opcional futuro
});

export const pizzaConfigSchema = z.object({
  size: z.enum(['pequena','media','grande','extra_grande']),
  flavors: z.array(z.string()).min(1),
  extras: z.array(z.object({ id: z.string(), price: z.number().positive() })).optional(),
  promoApplied: z.boolean().optional(),
  finalPrice: z.number().positive()
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(['CASH','PIX','CARD']),
  changeFor: z.number().nullable().optional(),
  items: z.array(orderItemSchema).min(1),
  pizzaConfigs: z.array(pizzaConfigSchema).optional(),
  discount: z.number().min(0).default(0).optional()
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELED']).optional(),
  paymentStatus: z.enum(['UNPAID','PAID','REFUNDED','PARTIAL']).optional()
}).refine(d => d.status || d.paymentStatus, { message: 'É necessário ao menos status ou paymentStatus' });

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
