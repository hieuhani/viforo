import { NavigationBar } from 'components/NavigationBar';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import '../styles.css';

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
    <>
      <Head>
        <title>Welcome to web!</title>
      </Head>
      {node}
    </>
  );
}
