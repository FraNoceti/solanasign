import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Agreement, IDL } from "../target/types/agreement";

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
    const args = {
      guarantorCount: 2,
      guarantors: [signer1Keypair.publicKey, signer2Keypair.publicKey],
      title: "test title",
      content: "test content",
    };

    const accounts = {
      agreement: agreementKeypair.publicKey,
      payer: (program.provider as anchor.AnchorProvider).wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };

    const tx = await program.methods
      .createAgreement(args)
      .accounts(accounts)
      .signers([agreementKeypair])
      .rpc();

    assert.isDefined(tx);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const agreement = await program.account.agreement.fetchNullable(
      agreementKeypair.publicKey,
      "confirmed"
    );

    assert.equal(agreement.title, "test title");
    assert.equal(agreement.content, "test content");
    assert.equal(agreement.guarantorCount, 2);
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
