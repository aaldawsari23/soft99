import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataProvider } from '@/lib/data-providers';
import { Order } from '@/types';

const ORDERS_KEY = 'orders';

export function useOrders(userId?: string) {
    return useQuery({
        queryKey: [ORDERS_KEY, userId],
        queryFn: () => getDataProvider().getOrders(userId),
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: [ORDERS_KEY, id],
        queryFn: () => getDataProvider().getOrderById(id),
        enabled: !!id,
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) =>
            getDataProvider().createOrder(order),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] });
        },
    });
}

export function useUpdateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Order> }) =>
            getDataProvider().updateOrder(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] });
            queryClient.invalidateQueries({ queryKey: [ORDERS_KEY, id] });
        },
    });
}
