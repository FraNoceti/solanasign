import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { useEnvironmentCtx } from '../providers/EnvironmentProvider';
import { createProvider } from '../utils/web3';

export const useProvider = () => {
  const wallet = useWallet();
  const { connection } = useEnvironmentCtx();
  return useMemo(
    () => createProvider(wallet, connection),
    [wallet, connection]
  );
};
