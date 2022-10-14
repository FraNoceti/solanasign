import {
  AgreementArgs,
  createCreateAgreementInstruction,
  createSignAgreementInstruction,
  PROGRAM_ID
} from '@agreement/js';
import { AnchorProvider, Program } from '@project-serum/anchor';
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction
} from '@solana/web3.js';
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
  // const wallet = (program.provider as AnchorProvider).wallet;
  guarantors.unshift(wallet.publicKey);

  // create agreement account
  const size = Math.max(
    Math.ceil(
      10 +
        Buffer.from(title, 'utf8').length * 2 +
        Buffer.from(content, 'utf8').length * 1.5 +
        guarantors.length * 42
    ),
    300
  );
  console.log(size);
  const rent = await connection.getMinimumBalanceForRentExemption(size);

  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: newAgreementKeypair.publicKey,
    lamports: rent,
    space: size,
    programId: PROGRAM_ID
  });

  const args = {
    guarantorCount: guarantors.length,
    guarantors,
    title,
    content
  };

  const accounts = {
    agreement: newAgreementKeypair.publicKey,
    payer: wallet.publicKey,
    systemProgram: SystemProgram.programId
  };

  // const createAgreementInstruction = createCreateAgreementInstruction(
  //   accounts,
  //   {
  //     args
  //   },
  //   PROGRAM_ID
  // );

  console.log('Before making');
  const createAgreementInstruction = await program.methods
    .createAgreement(args)
    .accounts(accounts)
    .instruction();

  console.log('After making');

  // using anchor provider
  const transaction = new Transaction();
  transaction.add(createAccountInstruction);
  transaction.add(createAgreementInstruction);

  try {
    // @ts-ignore
    const txSig = await program.provider.sendAndConfirm(
      transaction,
      [newAgreementKeypair],
      {
        preflightCommitment: 'confirmed'
      }
    );

    console.log(txSig);
    notify({
      message: 'Successsfully created the contract',
      type: 'success',
      txid: txSig
    });
    return true;
  } catch (e) {
    console.log(e);
    notify({
      message: `Create Assignment Failed`,
      description: `${e}`
    });
    return false;
  }

  // const transaction = await buildTransaction({
  //   provider: program.provider,
  //   instructions: [createAccountInstruction, createAgreementInstruction]
  // });

  // try {
  //   const signedTransaction = await wallet.signTransaction(transaction);

  //   signers.push(newAgreementKeypair);

  //   const result = await executeTransaction(
  //     connection,
  //     wallet,
  //     signedTransaction,
  //     {
  //       silent: false,
  //       signers
  //     }
  //   );

  //   if ('err' in result) {
  //     notify({
  //       message: `Create Assignment Failed`,
  //       description: `${result.err}`
  //     });
  //     return false;
  //   } else {
  //     notify({
  //       message: 'Successsfully created the contract',
  //       type: 'success',
  //       txid: result.sig
  //     });
  //     return true;
  //   }
  // } catch (e) {
  //   console.log(e);
  //   notify({
  //     message: `Create Assignment Failed`,
  //     description: `${e}`
  //   });
  //   return false;
  // }
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
