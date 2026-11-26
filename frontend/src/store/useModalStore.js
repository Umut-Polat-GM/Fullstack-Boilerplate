import { create } from "zustand";

/**
 * One global modal at a time, identified by `type`.
 *
 *   const openModal = useModalStore((s) => s.openModal);
 *   openModal("product-form", { product });      // open (with optional props)
 *
 *   const { type, props } = useModalStore((s) => s.modal);
 *   <Dialog open={type === "product-form"} />    // inside the modal component
 */
export const useModalStore = create((set) => ({
  modal: { type: null, props: {} },
  openModal: (type, props = {}) => set({ modal: { type, props } }),
  closeModal: () => set({ modal: { type: null, props: {} } }),
}));
