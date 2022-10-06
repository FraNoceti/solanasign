import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export const createProvider = (
  wallet: WalletContextState,
  connection: Connection
): anchor.AnchorProvider | null => {
  if (
    wallet &&
    wallet.publicKey &&
    wallet.signAllTransactions &&
    wallet.signTransaction
  ) {
    return new anchor.AnchorProvider(
      connection,
      {
        publicKey: wallet.publicKey,
        signAllTransactions: wallet.signAllTransactions,
        signTransaction: wallet.signTransaction
      },
      {
        commitment: 'confirmed'
      }
    );
  }
  return null;
};
