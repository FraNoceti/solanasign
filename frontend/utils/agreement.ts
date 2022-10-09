import {
  AgreementArgs,
  createCreateAgreementInstruction,
  createSignAgreementInstruction,
  PROGRAM_ID
} from '@agreement/js';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { notify } from '../common/Notification';
import { Agreement as AgreementProgram } from '../types/agreement';
import { buildTransaction, executeTransaction } from './web3';
import { Wallet } from '@saberhq/solana-contrib';

export const createAgreement = async (
  title: string,
  content: string,
  pubkeys: string[],
  program: Program<AgreementProgram>,
  connection: Connection,
  wallet: Wallet
): Promise<boolean> => {
  const newAgreementKeypair = new Keypair();
  const signers = [];
  const guarantors = pubkeys.map((item) => new PublicKey(item));
  guarantors.unshift(wallet.publicKey);

  const createAgreementInstruction = createCreateAgreementInstruction(
    {
      agreement: newAgreementKeypair.publicKey,
      payer: (program.provider as AnchorProvider).wallet.publicKey,
      systemProgram: SystemProgram.programId
    },
    {
      args: {
        guarantorCount: guarantors.length,
        guarantors,
        title,
        content
      }
    },
    PROGRAM_ID
  );

  const transaction = await buildTransaction({
    provider: program.provider,
    instructions: [createAgreementInstruction]
  });

  try {
    const signedTransaction = await wallet.signTransaction(transaction);

    signers.push(newAgreementKeypair);

    const result = await executeTransaction(
      connection,
      wallet,
      signedTransaction,
      {
        silent: false,
        signers
      }
    );

    if ('err' in result) {
      notify({
        message: `Create Assignment Failed`,
        description: `${result.err}`
      });
      return false;
    } else {
      notify({
        message: 'Successsfully created the contract',
        type: 'success',
        txid: result.sig
      });
      return true;
    }
  } catch (e) {
    notify({
      message: `Create Assignment Failed`,
      description: `${e}`
    });
    return false;
  }
};

export const signAgreement = async (
  contractKey: PublicKey,
  connection: Connection,
  program: Program<AgreementProgram>,
  wallet: Wallet
): Promise<boolean> => {
  const signAgreementInstruction = createSignAgreementInstruction({
    agreement: contractKey,
    payer: wallet.publicKey,
    systemProgram: SystemProgram.programId
  });

  const transaction = await buildTransaction({
    provider: program.provider,
    instructions: [signAgreementInstruction]
  });

  try {
    const signedTransaction = await wallet.signTransaction(transaction);

    const result = await executeTransaction(
      connection,
      wallet,
      signedTransaction,
      {
        silent: false
      }
    );

    if ('err' in result) {
      notify({
        message: `Sign Assignment Failed`,
        description: `${result.err}`
      });
      return false;
    } else {
      notify({
        message: 'Successsfully signed the contract',
        type: 'success',
        txid: result.sig
      });
      return true;
    }
  } catch (e) {
    notify({
      message: `Sign Assignment Failed`,
      description: `${e}`
    });
    return false;
  }
};

export const getAgreementData = async (
  program: Program<AgreementProgram>,
  pubkey: string
): Promise<AgreementArgs | null> => {
  const agreement = await program.account.agreement.fetchNullable(
    pubkey,
    'confirmed'
  );

  if (agreement) {
    return agreement as AgreementArgs;
  }
  return null;
};

export const alreadySigned = (
  agreement: AgreementArgs,
  pubkey: PublicKey | null
): boolean => {
  const signed =
    !!pubkey &&
    agreement.guarantors.findIndex(
      (guarantor) =>
        guarantor.wallet.toString() === pubkey.toString() &&
        guarantor.signed === 1
    ) > -1;
  return signed;
};
