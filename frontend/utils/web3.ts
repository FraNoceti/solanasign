import { WalletContextState } from '@solana/wallet-adapter-react';
import {
  Blockhash,
  Commitment,
  ConfirmOptions,
  Connection,
  PublicKey,
  SendOptions,
  Signer,
  Transaction,
  TransactionInstruction,
  TransactionSignature
} from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { Provider } from '@project-serum/anchor';
import { Wallet } from '@saberhq/solana-contrib';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const getAdapterNetwork = (net: string) => {
  switch (net) {
    case WalletAdapterNetwork.Testnet:
      return WalletAdapterNetwork.Testnet;
    case WalletAdapterNetwork.Mainnet:
      return WalletAdapterNetwork.Mainnet;
    default:
      return WalletAdapterNetwork.Devnet;
  }
};

export const asWallet = (wallet: WalletContextState): Wallet => {
  return {
    signTransaction: wallet.signTransaction!,
    signAllTransactions: wallet.signAllTransactions!,
    publicKey: wallet.publicKey!
  };
};

interface ErrorWithSignature extends Error {
  sig?: TransactionSignature;
}

export default function ErrorWithSignature(
  error: Error | string | Object | unknown,
  sig?: TransactionSignature
): ErrorWithSignature {
  return Object.assign(
    error instanceof Error
      ? error
      : new Error(typeof error === 'string' ? error : JSON.stringify(error)),
    { sig }
  );
}

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
    return new anchor.AnchorProvider(connection, asWallet(wallet), {
      commitment: 'confirmed'
    });
  }
  return null;
};

export type OnTransactionUpdateFunction = ({
  state,
  sig,
  error
}: {
  state: 'sent' | 'success' | 'error';
  sig?: TransactionSignature;
  error?: Error;
}) => void;

export const onlyExecuteTransaction = async (
  connection: Connection,
  signedTransaction: Transaction
): Promise<string> => {
  try {
    const serializedTransaction = signedTransaction.serialize();
    const sig = await connection.sendRawTransaction(serializedTransaction, {
      skipPreflight: true
    });
    const result = await connection.confirmTransaction(
      {
        blockhash: signedTransaction.recentBlockhash!,
        lastValidBlockHeight: signedTransaction.lastValidBlockHeight!,
        signature: sig
      },
      'confirmed'
    );
    return sig;
  } catch (e) {
    console.error(e);
    return 'error';
  }
};

export const executeOneTransaction = async (
  connection: Connection,
  wallet: Wallet,
  transaction: Transaction,
  config: {
    silent?: boolean;
    signers?: Signer[];
    commitment?: Commitment;
    confirmOptions?: ConfirmOptions;
    sendOptions?: SendOptions;
    signNeeded?: boolean;
    callback?: (success: boolean) => void;
  },
  onTransactionUpdate: OnTransactionUpdateFunction = ({ ...args }) => {}
): Promise<
  { sig: TransactionSignature } | { err: any; sig?: TransactionSignature }
> => {
  let sig;
  try {
    const latestBlockHash = await connection.getLatestBlockhash();
    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = latestBlockHash.blockhash;
    transaction.lastValidBlockHeight = latestBlockHash.lastValidBlockHeight;
    transaction = await wallet.signTransaction(transaction);

    if (config.signers && config.signers.length > 0) {
      transaction.partialSign(...config.signers);
    }

    const serializedTransaction = transaction.serialize();
    sig = await connection.sendRawTransaction(serializedTransaction, {
      skipPreflight: true,
      ...config.sendOptions
    });
    onTransactionUpdate({ state: 'sent', sig });

    const result = await connection.confirmTransaction(
      {
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: sig
      },
      config.commitment
    );

    if (!result) {
      throw ErrorWithSignature('Timed out', sig);
    } else if (result.value.err) {
      return { err: ErrorWithSignature(result.value.err, sig), sig };
    } else {
      onTransactionUpdate({ state: 'success', sig });
      return { sig };
    }
  } catch (e: unknown) {
    const error = ErrorWithSignature(e, sig);
    onTransactionUpdate({ state: 'error', sig, error });
    return { err: error, sig };
  }
};

export const buildTransaction = async ({
  provider,
  instructions,
  feePayer = (provider as anchor.AnchorProvider).wallet.publicKey,
  recentBlockhash,
  recentBlockHeight
}: {
  provider: Provider;
  instructions: TransactionInstruction[];
  feePayer?: PublicKey;
  recentBlockhash?: Blockhash;
  recentBlockHeight?: number;
}): Promise<Transaction> => {
  recentBlockhash =
    recentBlockhash ||
    (await provider.connection.getLatestBlockhash().then((b) => b.blockhash));
  const transaction = new Transaction();
  transaction.add(...instructions);
  transaction.feePayer = feePayer;
  transaction.recentBlockhash = recentBlockhash;
  transaction.lastValidBlockHeight = recentBlockHeight;
  return transaction;
};
