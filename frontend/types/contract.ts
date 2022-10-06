import { PublicKey } from '@solana/web3.js';

export type Guarantor = {
  wallet: PublicKey;
  signed: number;
  signedAt?: BigInt;
};

export type Contract = {
  version: number;
  guarantorCount: number;
  guarantors: Guarantor[];
  title: string;
  content: string;
};
