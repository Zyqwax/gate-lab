import { create } from 'zustand';

export type DialogType = 'info' | 'warning' | 'danger' | 'success' | 'error';

export interface DialogOptions {
  title: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  isConfirm?: boolean;
}

interface DialogState {
  isOpen: boolean;
  options: DialogOptions | null;
  resolve: ((value: boolean) => void) | null;
  openDialog: (options: DialogOptions) => Promise<boolean>;
  closeDialog: (result: boolean) => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  isOpen: false,
  options: null,
  resolve: null,

  openDialog: (options: DialogOptions) => {
    // If a dialog is already open, resolve previous one with false first
    const currentResolve = get().resolve;
    if (currentResolve) {
      currentResolve(false);
    }

    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        options,
        resolve,
      });
    });
  },

  closeDialog: (result: boolean) => {
    const { resolve } = get();
    if (resolve) {
      resolve(result);
    }
    set({
      isOpen: false,
      options: null,
      resolve: null,
    });
  },
}));

/**
 * Convenience helper to open a confirm modal (Two buttons: Confirm / Cancel)
 */
export async function confirmDialog(options: {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
}): Promise<boolean> {
  return useDialogStore.getState().openDialog({
    ...options,
    isConfirm: true,
  });
}

/**
 * Convenience helper to open an alert / info modal (Single button: OK)
 */
export async function alertDialog(
  titleOrOptions:
    | string
    | {
        title: string;
        message: string;
        buttonText?: string;
        type?: DialogType;
      },
  messageText?: string
): Promise<void> {
  let title = 'Bilgilendirme';
  let message = '';
  let buttonText = 'Tamam';
  let type: DialogType = 'info';

  if (typeof titleOrOptions === 'string') {
    if (messageText) {
      title = titleOrOptions;
      message = messageText;
    } else {
      message = titleOrOptions;
    }
  } else {
    title = titleOrOptions.title;
    message = titleOrOptions.message;
    buttonText = titleOrOptions.buttonText || 'Tamam';
    type = titleOrOptions.type || 'info';
  }

  await useDialogStore.getState().openDialog({
    title,
    message,
    confirmText: buttonText,
    type,
    isConfirm: false,
  });
}
