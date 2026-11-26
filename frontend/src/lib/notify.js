import { enqueueSnackbar } from "notistack";

/**
 * Global notifications — callable from anywhere (components, hooks, plain JS).
 *
 *   notify.success("Saved!");
 *   notify.error(error.message);
 */
const show = (variant) => (message, options) => enqueueSnackbar(message, { variant, ...options });

export const notify = {
  success: show("success"),
  error: show("error"),
  info: show("info"),
  warning: show("warning"),
};
