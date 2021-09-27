import { NavigationBar } from 'components/NavigationBar';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { createClient, Provider } from 'urql';
import { makeOperation } from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import Head from 'next/head';
import '../styles.css';

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
  if (!authState) {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    return null;
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
      token: authState!.refreshToken,
    }
  );

  if (result.data?.refreshLogin) {
    localStorage.setItem('token', result.data.refreshLogin.token);
    localStorage.setItem('refreshToken', result.data.refreshLogin.refreshToken);

    return {
      accessToken: result.data.refreshLogin.accessToken,
      refreshToken: result.data.refreshLogin.refreshToken,
    };
  }

  // This is where auth has gone wrong and we need to clean up and redirect to a login page
  localStorage.clear();
  // redirect to sign in page
  // logout();

  return null;
};

const client = createClient({
  url: 'http://localhost:3000/graphql',
  exchanges: [authExchange({ addAuthToOperation, getAuth })],
});

const LayoutAdmin = dynamic(() => import('layouts/admin/LayoutAdmin'), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.route.startsWith('/admin');
  const node = isAdminRoute ? (
    <LayoutAdmin>
      <Component {...pageProps} />
    </LayoutAdmin>
  ) : (
    <>
      <NavigationBar />
      <div className="h-16" />
      <Component {...pageProps} />
    </>
  );
  return (
    <Provider value={client}>
      <Head>
        <title>Welcome to web!</title>
      </Head>
      {node}
    </Provider>
  );
}
