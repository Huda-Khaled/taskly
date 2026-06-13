import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
