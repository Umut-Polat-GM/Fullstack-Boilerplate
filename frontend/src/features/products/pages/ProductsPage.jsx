import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { PackageOpen, Plus, RefreshCw } from "lucide-react";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { CONFIRM_MODAL } from "@/components/ui/ConfirmDialog";
import { PageHeader } from "@/components/ui/PageHeader";
import { useModalStore } from "@/store/useModalStore";
import { useDeleteProduct, useProducts } from "../api/products.queries";
import { ProductCard } from "../components/ProductCard";
import { PRODUCT_FORM_MODAL, ProductFormModal } from "../components/ProductFormModal";

const grid = "grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

export default function ProductsPage() {
  const { data: products = [], isPending, isError, error, refetch } = useProducts();
  const deleteProduct = useDeleteProduct();
  const openModal = useModalStore((s) => s.openModal);

  const handleCreate = () => openModal(PRODUCT_FORM_MODAL);
  const handleEdit = (product) => openModal(PRODUCT_FORM_MODAL, { product });
  const handleDelete = (product) =>
    openModal(CONFIRM_MODAL, {
      title: "Delete product?",
      message: `"${product.name}" will be permanently deleted.`,
      confirmText: "Delete",
      onConfirm: () => deleteProduct.mutateAsync(product.id).catch(() => {}),
    });

  return (
    <AnimatedPage>
      <PageHeader
        title="Products"
        description="Full CRUD demo: React Query → Express controller → Neon PostgreSQL."
        action={
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleCreate}>
            New product
          </Button>
        }
      />

      {isPending && (
        <div className={grid}>
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} variant="rounded" height={280} />
          ))}
        </div>
      )}

      {isError && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshCw size={14} />}
              onClick={() => refetch()}
            >
              Retry
            </Button>
          }
        >
          {error.message}
        </Alert>
      )}

      {!isPending && !isError && products.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 py-16 text-center dark:border-white/15">
          <PackageOpen size={48} className="text-slate-400" />
          <Typography variant="h6">No products yet</Typography>
          <Typography color="text.secondary">Create your first product to see it here.</Typography>
          <Button variant="outlined" startIcon={<Plus size={16} />} onClick={handleCreate}>
            Add product
          </Button>
        </div>
      )}

      {products.length > 0 && (
        <div className={grid}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ProductFormModal />
    </AnimatedPage>
  );
}
