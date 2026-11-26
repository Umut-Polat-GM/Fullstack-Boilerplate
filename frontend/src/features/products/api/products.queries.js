import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/lib/notify";
import { productsApi } from "./products.api";

export const productKeys = {
  all: ["products"],
  detail: (id) => ["products", id],
};

export const useProducts = () => useQuery({ queryKey: productKeys.all, queryFn: productsApi.list });

/** Shared mutation factory: invalidates the list and shows a toast. */
function useProductMutation(mutationFn, successMessage) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      notify.success(successMessage);
    },
    onError: (error) => notify.error(error.message),
  });
}

export const useCreateProduct = () => useProductMutation(productsApi.create, "Product created");

export const useUpdateProduct = () =>
  useProductMutation(({ id, ...data }) => productsApi.update(id, data), "Product updated");

export const useDeleteProduct = () => useProductMutation(productsApi.remove, "Product deleted");
