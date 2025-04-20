import { writable } from 'svelte/store';

// Safe Mode Store
export const safeMode = writable<boolean>(false);

// Compliance Mode Store
export const complianceMode = writable<boolean>(false);

// Modal Store für Cease & Desist Alert
type ModalState = {
  open: boolean;
  title: string;
  message: string;
  showCancel: boolean;
};

const createModalStore = () => {
  const defaultState: ModalState = {
    open: false,
    title: '',
    message: '',
    showCancel: false
  };
  
  const { subscribe, set, update } = writable<ModalState>(defaultState);
  
  return {
    subscribe,
    set,
    update,
    open: (title: string, message: string, showCancel = false) => {
      set({
        open: true,
        title,
        message,
        showCancel
      });
    },
    close: () => {
      set({
        ...defaultState
      });
    }
  };
};

export const modalStore = createModalStore();

// Open Source Offender Store
export const scanResults = writable<string[]>([]);