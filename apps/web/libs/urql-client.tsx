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

type AuthState = {
  accessToken: string;
  refreshToken: string;
};
type GetAuthParams = {
  authState: AuthState;
  mutate: any;
};

const addAuthToOperation = ({ authState, operation }) => {
  if (!authState || !authState.token) {
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
        Authorization: authState.token,
      },
    },
  });
};

const getAuth = async ({
  authState,
  mutate,
}: GetAuthParams): Promise<AuthState | null> => {
  console.log(authState);
  // if (!authState) {
  //   const accessToken = localStorage.getItem('accessToken');
  //   const refreshToken = localStorage.getItem('refreshToken');
  //   if (accessToken && refreshToken) {
  //     return { accessToken, refreshToken };
  //   }
  //   return null;
  // }

  // const result = await mutate(
  //   `
  //   mutation RefreshToken($token: String!) {
  //     refreshToken(token: $token) {
  //       accessToken
  //       refreshToken
  //     }
  //   }`,
  //   {
  //     token: authState!.refreshToken,
  //   }
  // );

  // if (result.data?.refreshLogin) {
  //   localStorage.setItem('token', result.data.refreshLogin.token);
  //   localStorage.setItem('refreshToken', result.data.refreshLogin.refreshToken);

  //   return {
  //     accessToken: result.data.refreshLogin.accessToken,
  //     refreshToken: result.data.refreshLogin.refreshToken,
  //   };
  // }

  // This is where auth has gone wrong and we need to clean up and redirect to a login page
  // localStorage.clear();
  // redirect to sign in page
  // logout();

  return null;
};

// authExchange({ addAuthToOperation, getAuth }),

export function withUrql<T>(Component: ComponentType<T>) {
  return withUrqlClient((ssrExchange) => ({
    url: 'http://localhost:3000/graphql',
    exchanges: [
      dedupExchange,
      cacheExchange,
      authExchange({ addAuthToOperation, getAuth }),
      ssrExchange,
      fetchExchange,
    ],
  }))(Component);
}
