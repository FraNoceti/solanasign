import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/globals.css';
import '../styles/tailwind.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  EnvironmentProvider,
  getInitialProps
} from '../providers/EnvironmentProvider';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { getWalletAdapters } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ToastContainer } from '../common/Notification';

require('@solana/wallet-adapter-react-ui/styles.css');

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
});

const App = ({
  Component,
  pageProps,
  cluster
}: AppProps & {
  cluster: string;
}) => (
  <EnvironmentProvider defaultCluster={cluster}>
    <WalletProvider autoConnect wallets={getWalletAdapters()}>
      <WalletModalProvider>
        <QueryClientProvider client={queryClient}>
          <>
            <ToastContainer />
            <Component {...pageProps} />
          </>
        </QueryClientProvider>
      </WalletModalProvider>
    </WalletProvider>
  </EnvironmentProvider>
);

App.getInitialProps = getInitialProps;

export default App;
