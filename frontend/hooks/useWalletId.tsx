import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { tryPublicKey } from '../utils/basic';

export const useWalletId = () => {
  const wallet = useWallet();
  const { query } = useRouter();
  return tryPublicKey(query.wallet) || wallet.publicKey;
};
