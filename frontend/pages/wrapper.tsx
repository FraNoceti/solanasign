import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  BitKeepWalletAdapter,
  CloverWalletAdapter,
  Coin98WalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  SolongWalletAdapter,
  TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from '../common/Notification';
import { AgreementProvider } from '../providers/AgreementProvider';
import { useEnvironmentCtx } from '../providers/EnvironmentProvider';
import { getAdapterNetwork } from '../utils/web3';
require('@solana/wallet-adapter-react-ui/styles.css');

interface Props {
  children?: ReactNode;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
});

const Wrapper: React.FC<Props> = ({ children }: Props) => {
  const { environment } = useEnvironmentCtx();
  const network = getAdapterNetwork(environment.label);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new CloverWalletAdapter({ network }),
      new MathWalletAdapter({ network }),
      new SolongWalletAdapter({ network }),
      new BitKeepWalletAdapter({ network }),
      new Coin98WalletAdapter({ network })
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={wallets}>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <AgreementProvider>
              <ToastContainer />
              {children}
            </AgreementProvider>
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Wrapper;
