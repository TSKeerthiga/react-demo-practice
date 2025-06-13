
import { RootState } from '../app/store';

export const getAuthHeaders = (state: RootState) => {
  const token = state.auth.token;
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
};
