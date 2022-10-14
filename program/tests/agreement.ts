import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SystemProgram, Transaction } from "@solana/web3.js";
import { assert } from "chai";
import { Agreement, IDL } from "../target/types/agreement";
import { getOffset, splitIntoSmallerParts } from './content';

describe("Agreement Test", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Agreement as Program<Agreement>;

  const signer1Keypair = anchor.web3.Keypair.generate();
  const signer2Keypair = anchor.web3.Keypair.generate();
  const agreementKeypair = anchor.web3.Keypair.generate();

  it("Airdrop sol to signers", async () => {
    const amount = 2;

    const sig1 = await program.provider.connection.requestAirdrop(
      signer1Keypair.publicKey,
      amount * anchor.web3.LAMPORTS_PER_SOL
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await program.provider.connection.confirmTransaction(sig1);

    const signer1Lamports = await program.provider.connection.getBalance(
      signer1Keypair.publicKey,
      { commitment: "confirmed" }
    );

    assert.equal(signer1Lamports, amount * anchor.web3.LAMPORTS_PER_SOL);

    const sig2 = await program.provider.connection.requestAirdrop(
      signer2Keypair.publicKey,
      amount * anchor.web3.LAMPORTS_PER_SOL
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await program.provider.connection.confirmTransaction(sig2);

    const signer2Lamports = await program.provider.connection.getBalance(
      signer2Keypair.publicKey,
      { commitment: "confirmed" }
    );

    assert.equal(signer2Lamports, amount * anchor.web3.LAMPORTS_PER_SOL);
  });

  it("Creates an agreement", async () => {
    const title = "test title";
    const content = "test content";
    
    const transaction = new Transaction();

    // content length
    const contentLength = Buffer.from(content, "utf8").length;
    const titleLength = Buffer.from(title, "utf8").length;

    // create account instruction
    let size = Math.max(
      Math.ceil(
        10 +
          256 +
          contentLength * 1.5 +
          2 * 42
      ),
      300
    );

    const rent =
      await program.provider.connection.getMinimumBalanceForRentExemption(size);

    const createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: (program.provider as anchor.AnchorProvider).wallet.publicKey,
      newAccountPubkey: agreementKeypair.publicKey,
      lamports: rent,
      space: size,
      programId: program.programId,
    });

    transaction.add(createAccountInstruction);

    // create agreement instruction
    const args = {
      guarantorCount: 2,
      guarantors: [signer1Keypair.publicKey, signer2Keypair.publicKey],
      title,
      contentLength
    };

    const accounts = {
      agreement: agreementKeypair.publicKey,
      payer: (program.provider as anchor.AnchorProvider).wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };

    const createAgreementInstruction = await program.methods
      .createAgreement(args)
      .accounts(accounts)
      .instruction();

    transaction.add(createAgreementInstruction);

    // @ts-ignore
    const txSig = await program.provider.sendAndConfirm(
      transaction,
      [agreementKeypair],
      {
        preflightCommitment: "confirmed",
      }
    );

    // update agreement instruction
    const smallerContents = splitIntoSmallerParts(Buffer.from(content), 512);
    let startOffset = getOffset(args.guarantorCount, titleLength);

    await Promise.all(smallerContents.map(async (contentItem, index) => {
        try {        
          const tx = await program.methods.updateAgreement({
            offset: startOffset + 512 * index,
            length: contentItem.length,
            content: contentItem
          }).accounts({
            agreement: agreementKeypair.publicKey,
            payer: (program.provider as anchor.AnchorProvider).wallet.publicKey,
          }).rpc();
          console.log(tx);
        }catch(e){
          console.error(e)
        }
    }))    

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const agreement = await program.account.agreement.fetchNullable(
      agreementKeypair.publicKey,
      "confirmed"
    );
        
    assert.equal(agreement.version, 1);
    assert.equal(agreement.guarantorCount, 2);
    assert.equal(agreement.title, title);
    assert.equal(agreement.content, content);
    assert.equal(
      agreement.guarantors[0].wallet.toString(),
      signer1Keypair.publicKey.toString()
    );
    assert.equal(
      agreement.guarantors[1].wallet.toString(),
      signer2Keypair.publicKey.toString()
    );

    console.log("agreement before signing", agreement);
  });

  it("Signs to agreement", async () => {
    const signer1Provider = new anchor.AnchorProvider(
      program.provider.connection,
      new anchor.Wallet(signer1Keypair),
      { commitment: "confirmed" }
    );

    const signer1Program = new anchor.Program(
      IDL,
      program.programId,
      signer1Provider
    );

    const accounts1 = {
      agreement: agreementKeypair.publicKey,
      payer: signer1Keypair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };

    const tx1 = await signer1Program.methods
      .signAgreement()
      .accounts(accounts1)
      .rpc();

    assert.isDefined(tx1);

    let agreement;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    agreement = await program.account.agreement.fetchNullable(
      agreementKeypair.publicKey,
      "confirmed"
    );

    assert.equal(
      agreement.guarantors[0].wallet.toString(),
      signer1Keypair.publicKey.toString()
    );
    assert.equal(agreement.guarantors[0].signed, 1);

    const signer2Provider = new anchor.AnchorProvider(
      program.provider.connection,
      new anchor.Wallet(signer2Keypair),
      { commitment: "confirmed" }
    );

    const signer2Program = new anchor.Program(
      IDL,
      program.programId,
      signer2Provider
    );

    const accounts2 = {
      agreement: agreementKeypair.publicKey,
      payer: signer2Keypair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };

    const tx2 = await signer2Program.methods
      .signAgreement()
      .accounts(accounts2)
      .rpc();

    assert.isDefined(tx2);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    agreement = await program.account.agreement.fetchNullable(
      agreementKeypair.publicKey,
      "confirmed"
    );

    assert.equal(
      agreement.guarantors[1].wallet.toString(),
      signer2Keypair.publicKey.toString()
    );
    assert.equal(agreement.guarantors[1].signed, 1);

    console.log("agreement after signing", agreement);
  });
});
