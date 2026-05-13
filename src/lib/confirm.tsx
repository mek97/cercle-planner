import { toast } from "sonner";

// Thin wrapper around sonner that gives us a Promise<boolean> for
// confirm-style flows — no more native window.confirm() dialogs.
export function toastConfirm(
  title: string,
  description?: string,
  opts?: { confirmLabel?: string; cancelLabel?: string; destructive?: boolean }
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const id = toast(title, {
      description,
      duration: 8000,
      action: {
        label: opts?.confirmLabel ?? "Confirm",
        onClick: () => { toast.dismiss(id); resolve(true); },
      },
      cancel: {
        label: opts?.cancelLabel ?? "Cancel",
        onClick: () => { toast.dismiss(id); resolve(false); },
      },
      onAutoClose: () => resolve(false),
      onDismiss: () => resolve(false),
      classNames: opts?.destructive ? { toast: "!border-rose-500/40" } : undefined,
    });
  });
}
