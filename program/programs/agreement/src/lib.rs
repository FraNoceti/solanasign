use anchor_lang::{prelude::*, solana_program::clock, Discriminator};
use std::{mem, str};

declare_id!("AzST5p5ATAN1ABdwWXzV7Z8667b3qqA1JUz9w7eWE6Dt");

#[program]
pub mod agreement {
    use super::*;

    pub fn create_agreement<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, CreateAgreement>,
        args: CreateAgreementArgs,
    ) -> Result<()> {
        if ctx.accounts.agreement.owner != ctx.program_id {
            return Err(error!(ErrorCode::AccountNotProgramData));
        }
        let mut agreement_data = ctx.accounts.agreement.data.borrow_mut();

        // check if the agreement data is zeroed
        if agreement_data[..8] != [0; 8] {
            return Err(error!(ErrorCode::AccountNotProgramData));
        }
        agreement_data[..8].copy_from_slice(&<Agreement as Discriminator>::discriminator());

        // insert other data
        require!(
            args.guarantor_count == args.guarantors.len() as u8,
            GuarantorCountMismatch
        );

        msg!("Guarantor size is {}", mem::size_of::<Guarantor>());
        msg!("Agreement size is {}", mem::size_of::<Agreement>());

        // write version
        let version_ref = &mut agreement_data[8..][..1];
        version_ref[0] = 1;

        // write guarantor count
        let guarantor_count_ref = &mut agreement_data[9..][..1];
        guarantor_count_ref[0] = args.guarantor_count;
        let mut start_offset = 10;

        // write guarantors
        let mut guarantor_arr = vec![];
        for guarantor in args.guarantors {
            let new_guarantor = Guarantor {
                wallet: guarantor,
                signed: 0,
                signed_at: None,
            };

            guarantor_arr.push(new_guarantor);
        }
        let guarantor_size: usize = (args.guarantor_count as usize) * (32 + 1 + 1) + 4;
        let mut guarantor_ref = &mut agreement_data[start_offset..][..guarantor_size];
        guarantor_arr.serialize(&mut guarantor_ref)?;
        start_offset += guarantor_size;

        // write title
        let title_bytes = args.title.as_bytes();
        let title_size = title_bytes.len() + 4;
        let mut title_ref = &mut agreement_data[start_offset..][..title_size];
        args.title.serialize(&mut title_ref)?;

        // write content
        start_offset += title_size;
        let mut content_ref = &mut agreement_data[start_offset..][..4];
        args.content_length.serialize(&mut content_ref)?;

        msg!("Final offset is {}", start_offset + 4);
        Ok(())
    }

    pub fn update_agreement<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, UpdateAgreement<'info>>,
        args: UpdateAgreementArgs,
    ) -> Result<()> {
        let agreement_account_info = &mut ctx.accounts.agreement.to_account_info();
        let mut data = agreement_account_info.data.borrow_mut();
        let content_ref = &mut data[args.offset as usize..][..args.length as usize];
        let serialized: &[u8] = &args.content.as_slice();
        content_ref.copy_from_slice(serialized);

        // actuall change that field
        let vvv = &data[100..];
        let s = match String::from_utf8(vvv.to_vec()) {
            Ok(v) => v,
            Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
        };
        let agreement = &mut ctx.accounts.agreement;
        agreement.content = s;

        Ok(())
    }

    pub fn sign_agreement<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, SignAgreement<'info>>,
    ) -> Result<()> {
        let agreement = &mut ctx.accounts.agreement;
        let payer = &mut ctx.accounts.payer;

        let clock = clock::Clock::get()?;

        let mut guarantor_exists = false;
        let mut guarantor_arr = vec![];
        for guarantor in &agreement.guarantors {
            if guarantor.wallet == payer.key() {
                guarantor_arr.push(Guarantor {
                    wallet: guarantor.wallet,
                    signed: 1,
                    signed_at: Some(clock.unix_timestamp),
                });

                guarantor_exists = true;
            } else {
                guarantor_arr.push(guarantor.clone());
            }
        }

        require!(guarantor_exists, GuarantorDoesNotExist);

        agreement.guarantors = guarantor_arr;

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreateAgreementArgs {
    pub guarantor_count: u8,
    pub guarantors: Vec<Pubkey>,
    pub title: String,
    pub content_length: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdateAgreementArgs {
    pub offset: u32,
    pub length: u32,
    pub content: Vec<u8>,
}

#[derive(Accounts)]
pub struct CreateAgreement<'info> {
    /// CHECK: This is for personal use
    #[account(mut)]
    pub agreement: AccountInfo<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAgreement<'info> {
    #[account(mut)]
    pub agreement: Box<Account<'info, Agreement>>,
    #[account(mut)]
    pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct SignAgreement<'info> {
    #[account(mut)]
    pub agreement: Box<Account<'info, Agreement>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Agreement {
    pub version: u8,
    pub guarantor_count: u8,
    pub guarantors: Vec<Guarantor>,
    pub title: String,
    pub content: String,
}

#[repr(C)]
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Guarantor {
    pub wallet: Pubkey,
    pub signed: u8,
    pub signed_at: Option<i64>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Number of guarantors mismatch!")]
    GuarantorCountMismatch,
    #[msg("Guarantor does not exist!")]
    GuarantorDoesNotExist,
    #[msg("Account is not a program data!")]
    AccountNotProgramData,
}
