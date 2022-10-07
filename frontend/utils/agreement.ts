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
): Promise<void> => {
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
        guarantorCount: pubkeys.length,
        guarantors,
        title,
        content
      }
    },
    PROGRAM_ID
  );
  console.log(createAgreementInstruction);

  const transaction = await buildTransaction({
    provider: program.provider,
    instructions: [createAgreementInstruction]
  });

  signers.push(newAgreementKeypair);

  try {
    const result = await executeTransaction(connection, wallet, transaction, {
      silent: false
    });

    if ('err' in result) {
      notify({
        message: `Create Assignment Failed`,
        description: `${result.err}`
      });
    } else {
      notify({
        message: 'Successsfully created the contract',
        type: 'success',
        txid: result.sig
      });
    }
  } catch (e) {
    notify({
      message: `Create Assignment Failed`,
      description: `${e}`
    });
  }
};
