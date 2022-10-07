import { createCreateAgreementInstruction, PROGRAM_ID } from '@agreement/js';
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
