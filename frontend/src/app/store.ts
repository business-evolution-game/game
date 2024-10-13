import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@entities/user';

export const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
    },
    devTools: import.meta.env.VITE_DEV_MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;