import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useModalStore } from "@/store/useModalStore";

export const CONFIRM_MODAL = "confirm";

/**
 * Global confirm dialog driven by the modal store:
 *
 *   openModal(CONFIRM_MODAL, { title, message, confirmText, onConfirm })
 */
export function ConfirmDialog() {
  const { type, props } = useModalStore((s) => s.modal);
  const closeModal = useModalStore((s) => s.closeModal);
  const open = type === CONFIRM_MODAL;

  const handleConfirm = async () => {
    await props.onConfirm?.();
    closeModal();
  };

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="xs" fullWidth>
      <DialogTitle>{props.title ?? "Are you sure?"}</DialogTitle>
      {props.message && (
        <DialogContent>
          <DialogContentText>{props.message}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={closeModal} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" color={props.color ?? "error"}>
          {props.confirmText ?? "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
