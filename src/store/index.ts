
import { configureStore } from '@reduxjs/toolkit';
import recommendationReducer from './slices/recommendationSlice';

export const store = configureStore({
  reducer: {
    recommendations: recommendationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
