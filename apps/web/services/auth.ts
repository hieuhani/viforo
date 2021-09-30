const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

export type AuthState = {
  accessToken: string;
  refreshToken: string;
};

export const getAuthState = (): AuthState => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
};

export const updateAuthState = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
};

export const clearAuthState = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};
