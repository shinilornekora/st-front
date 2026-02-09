import { createStore, createEvent } from 'effector';

export type ToastType = 'success' | 'error' | 'info';

export const showToast = createEvent<string | { message: string; type?: ToastType }>();
export const hideToast = createEvent();

export const $toast = createStore<{ show: boolean; message: string; type: ToastType }>({
  show: false,
  message: '',
  type: 'success',
})
  .on(showToast, (_, payload) => {
    if (typeof payload === 'string') {
      return { show: true, message: payload, type: 'success' as ToastType };
    }
    return { show: true, message: payload.message, type: payload.type || 'success' };
  })
  .on(hideToast, (state) => ({ ...state, show: false }));
