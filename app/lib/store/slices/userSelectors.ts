import type { RootState } from '../index';

export const selectUser = (state: RootState) => state.user.data;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserLoading = (state: RootState) =>
  state.user.status === 'loading';
