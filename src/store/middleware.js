import { createToast, removeToast } from "./toastSlice";
import { createListenerMiddleware } from "@reduxjs/toolkit";

export const toastMiddleware = createListenerMiddleware();

toastMiddleware.startListening({
    actionCreator: createToast,
    effect: async (action, listenerApi) => {
        const state = listenerApi.getState();
        const toastArrLen = state.toasts.toasts.length - 1;
        const latestToast = state.toasts.toasts[toastArrLen];

        if (!latestToast) return;

        await listenerApi.delay(latestToast.duration);

        listenerApi.dispatch(removeToast(latestToast.id));
    }
})