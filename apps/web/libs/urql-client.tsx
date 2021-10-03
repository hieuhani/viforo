import { createClient } from 'urql';
import {
  makeOperation,
  dedupExchange,
  cacheExchange,
  fetchExchange,
} from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import { withUrqlClient } from 'next-urql';
import { ComponentType } from 'react';
import {
  AuthState,
  clearAuthState,
  getAuthState,
  updateAuthState,
} from 'services/auth';

type GetAuthParams = {
  authState: AuthState;
  mutate: any;
};

const addAuthToOperation = ({ authState, operation }) => {
  if (!authState || !authState.accessToken) {
    return operation;
  }

  const fetchOptions =
    typeof operation.context.fetchOptions === 'function'
      ? operation.context.fetchOptions()
      : operation.context.fetchOptions || {};

  return makeOperation(operation.kind, operation, {
    ...operation.context,
    fetchOptions: {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${authState.accessToken}`,
      },
    },
  });
};

const getAuth = async ({
  authState,
  mutate,
}: GetAuthParams): Promise<AuthState | null> => {
  const token = getAuthState();
  if (!token) {
    return null;
  }
  if (!authState && token.accessToken) {
    return token;
  }

  const result = await mutate(
    `
    mutation RefreshToken($token: String!) {
      refreshToken(token: $token) {
        accessToken
        refreshToken
      }
    }`,
    {
      token: token.refreshToken,
    }
  );

  if (result.data?.refreshToken) {
    updateAuthState(
      result.data.refreshToken.accessToken,
      result.data.refreshToken.refreshToken
    );

    return {
      accessToken: result.data.refreshToken.accessToken,
      refreshToken: result.data.refreshToken.refreshToken,
    };
  }

  clearAuthState();
  // logout();

  return null;
};

const isServerSide = typeof window === 'undefined';

export const urqlClient = createClient({
  url: 'http://localhost:3000/graphql',
  exchanges: [
    dedupExchange,
    cacheExchange,
    isServerSide ? undefined : authExchange({ addAuthToOperation, getAuth }),
    fetchExchange,
  ].filter(Boolean),
});

export function withUrql<T>(Component: ComponentType<T>) {
  return withUrqlClient((ssrExchange) => ({
    url: 'http://localhost:3000/graphql',
    exchanges: [
      dedupExchange,
      cacheExchange,
      isServerSide ? undefined : authExchange({ addAuthToOperation, getAuth }),
      ssrExchange,
      fetchExchange,
    ].filter(Boolean),
  }))(Component);
}
