import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import { LottieLight } from "lottie-react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import taskAnimation from "@/assets/json/Task.json";
import { useModalStore } from "@/store/useModalStore";
import { useCreateProduct, useUpdateProduct } from "../api/products.queries";
import { productSchema } from "../product.schema";

export const PRODUCT_FORM_MODAL = "product-form";

const emptyValues = { name: "", image: "", price: "" };

/**
 * Create / edit dialog. Open it with:
 *   openModal(PRODUCT_FORM_MODAL)               → create
 *   openModal(PRODUCT_FORM_MODAL, { product })  → edit
 */
export function ProductFormModal() {
  const { type, props } = useModalStore((s) => s.modal);
  const closeModal = useModalStore((s) => s.closeModal);
  const open = type === PRODUCT_FORM_MODAL;
  const product = props.product;
  const isEdit = Boolean(product);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isSaving = createProduct.isPending || updateProduct.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(productSchema), defaultValues: emptyValues });

  useEffect(() => {
    if (open)
      reset(
        product ? { name: product.name, image: product.image, price: product.price } : emptyValues,
      );
  }, [open, product, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) await updateProduct.mutateAsync({ id: product.id, ...data });
      else await createProduct.mutateAsync(data);
      closeModal();
    } catch {
      // error toast is shown by the mutation's onError
    }
  };

  return (
    <Dialog open={open} onClose={isSaving ? undefined : closeModal} maxWidth="sm" fullWidth>
      {isSaving && <LinearProgress />}
      <DialogTitle className="flex items-center justify-between">
        {isEdit ? "Edit product" : "New product"}
        <IconButton onClick={closeModal} disabled={isSaving} aria-label="close">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent className="grid gap-4 sm:grid-cols-[140px_1fr]">
          <LottieLight
            src={taskAnimation}
            autoplay
            className="hidden size-36 self-center sm:block"
          />
          <div className="flex flex-col gap-4">
            <TextField
              label="Name"
              autoFocus
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Image URL"
              placeholder="https://…"
              {...register("image")}
              error={!!errors.image}
              helperText={errors.image?.message}
            />
            <TextField
              label="Price"
              type="number"
              {...register("price")}
              error={!!errors.price}
              helperText={errors.price?.message}
              slotProps={{
                htmlInput: { step: "0.01", min: 0 },
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
              }}
            />
          </div>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={closeModal} color="inherit" disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={isSaving}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
