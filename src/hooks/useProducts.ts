import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDataProvider } from '@/lib/data-providers';
import { Product, ProductFilters } from '@/types';

const PRODUCTS_KEY = 'products';

export function useProducts(filters?: ProductFilters) {
    return useQuery({
        queryKey: [PRODUCTS_KEY, filters],
        queryFn: () => getDataProvider().getProducts(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: [PRODUCTS_KEY, id],
        queryFn: () => getDataProvider().getProductById(id),
        enabled: !!id,
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) =>
            getDataProvider().createProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
            getDataProvider().updateProduct(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY, id] });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => getDataProvider().deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
        },
    });
}
