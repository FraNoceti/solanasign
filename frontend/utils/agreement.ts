import {
  AgreementArgs,
  createCreateAgreementInstruction,
  createSignAgreementInstruction,
  createUpdateAgreementInstruction,
  PROGRAM_ID
} from '@agreement/js';
import { AnchorProvider, Program } from '@project-serum/anchor';
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  SystemProgram,
  Transaction
} from '@solana/web3.js';
import { notify } from '../common/Notification';
import { Agreement as AgreementProgram } from '../types/agreement';
import {
  buildTransaction,
  executeOneTransaction,
  onlyExecuteTransaction
} from './web3';
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

  // get the blockhash
  const latestBlockHash = await connection.getLatestBlockhash();

  // create account instruction
  const titleLength = Buffer.from(title, 'utf8').length;
  const contentLength = Buffer.from(content, 'utf8').length;
  const size = Math.max(
    Math.ceil(
      10 + titleLength * 2 + contentLength * 1.5 + guarantors.length * 42
    ),
    300
  );
  const rent = await connection.getMinimumBalanceForRentExemption(size);

  const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: newAgreementKeypair.publicKey,
    lamports: rent,
    space: size,
    programId: PROGRAM_ID
  });

  // create agreement instruction
  const args = {
    guarantorCount: guarantors.length,
    guarantors,
    title,
    contentLength
  };

  const accounts = {
    agreement: newAgreementKeypair.publicKey,
    payer: wallet.publicKey,
    systemProgram: SystemProgram.programId
  };

  const createAgreementInstruction = createCreateAgreementInstruction(
    accounts,
    {
      args
    },
    PROGRAM_ID
  );

  const createTransaction = await buildTransaction({
    provider: program.provider,
    instructions: [createAccountInstruction, createAgreementInstruction],
    feePayer: wallet.publicKey,
    recentBlockhash: latestBlockHash.blockhash,
    recentBlockHeight: latestBlockHash.lastValidBlockHeight
  });

  signers.push(newAgreementKeypair);
  createTransaction.partialSign(...signers);

  // const createResult = await signAndExecuteTransaction(
  //   wallet,
  //   connection,
  //   createTransaction,
  //   'Create',
  //   signers
  // );

  // if (!createResult) {
  //   return false;
  // }

  // update agreement instruction
  const updateTxs: Transaction[] = [createTransaction];
  const smallerContents = splitIntoSmallerParts(Buffer.from(content), 512);
  let startOffset = getOffset(args.guarantorCount, titleLength);

  await Promise.all(
    smallerContents.map(async (contentItem, index) => {
      const updateAgreementInstruction = createUpdateAgreementInstruction(
        {
          agreement: newAgreementKeypair.publicKey,
          payer: wallet.publicKey
        },
        {
          args: {
            offset: startOffset + 512 * index,
            length: contentItem.length,
            content: contentItem
          }
        },
        PROGRAM_ID
      );
      updateTxs.push(
        await buildTransaction({
          provider: program.provider,
          instructions: [updateAgreementInstruction],
          feePayer: wallet.publicKey,
          recentBlockhash: latestBlockHash.blockhash,
          recentBlockHeight: latestBlockHash.lastValidBlockHeight
        })
      );
    })
  );

  const signedTransactions = await wallet.signAllTransactions(updateTxs);

  let updateResult = true;
  updateResult = await executeTransactions(
    wallet,
    connection,
    signedTransactions
  );

  return updateResult;
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
    const result = await executeOneTransaction(
      connection,
      wallet,
      transaction,
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

export const splitIntoSmallerParts = (
  content: Buffer,
  size: number
): Buffer[] => {
  let smallerContents: Buffer[] = [];
  let start = 0;
  while (start <= content.length) {
    smallerContents.push(content.subarray(start, start + size));
    start += size;
  }
  return smallerContents;
};

export const getOffset = (guarantors: number, titleLength: number): number =>
  10 + 34 * guarantors + 4 + titleLength + 4 + 4;

export const signAndExecuteTransaction = async (
  wallet: Wallet,
  connection: Connection,
  transaction: Transaction,
  txPrefix: string,
  signers: Signer[] | undefined = undefined
): Promise<boolean> => {
  try {
    const result = await executeOneTransaction(
      connection,
      wallet,
      transaction,
      {
        silent: false,
        signers
      }
    );

    if ('err' in result) {
      notify({
        message: `${txPrefix} Transaction Failed`,
        description: `${result.err}`,
        type: 'error'
      });
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.log(e);
    notify({
      message: `${txPrefix} Transaction Failed`,
      description: `${e}`,
      type: 'error'
    });
    return false;
  }
};

export const executeTransactions = async (
  wallet: Wallet,
  connection: Connection,
  txs: Transaction[]
): Promise<boolean> => {
  let executedResult = true;
  await Promise.all(
    txs.map(async (tx, index) => {
      try {
        const result = await onlyExecuteTransaction(connection, tx);
        if (result === 'error') {
          executedResult = false;
        }
        console.log(`${index}th signature: `, result);
      } catch (e) {
        console.error(e);
        executedResult = false;
      }
    })
  );
  return executedResult;
};
