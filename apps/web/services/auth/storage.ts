import Cookies from 'js-cookie';

import { parseJwtWithoutKey } from '../../libs/jwt';

const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

export type AuthState = {
  accessToken?: string;
  refreshToken: string;
};

export const getAuthState = (): AuthState => {
  const accessToken = Cookies.get(ACCESS_TOKEN_STORAGE_KEY);
  const refreshToken = Cookies.get(REFRESH_TOKEN_STORAGE_KEY);
  if (!refreshToken) {
    return null;
  }
  return {
    accessToken,
    refreshToken,
  };
};

export const updateAuthState = (accessToken: string, refreshToken: string) => {
  const parsedAccessToken = parseJwtWithoutKey(accessToken);
  if (parsedAccessToken && parsedAccessToken.exp) {
    Cookies.set(ACCESS_TOKEN_STORAGE_KEY, accessToken, {
      expires: new Date(parsedAccessToken.exp * 1000),
    });
  }

  const parsedRefreshToken = parseJwtWithoutKey(refreshToken);
  if (parsedRefreshToken && parsedRefreshToken.exp) {
    Cookies.set(REFRESH_TOKEN_STORAGE_KEY, refreshToken, {
      expires: new Date(parsedRefreshToken.exp * 1000),
    });
  }
};

export const clearAuthState = (): void => {
  Cookies.remove(ACCESS_TOKEN_STORAGE_KEY);
  Cookies.remove(REFRESH_TOKEN_STORAGE_KEY);
};
