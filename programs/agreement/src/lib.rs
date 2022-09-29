use anchor_lang::{prelude::*, solana_program::clock};

declare_id!("AzST5p5ATAN1ABdwWXzV7Z8667b3qqA1JUz9w7eWE6Dt");

#[program]
pub mod agreement {
    use super::*;

    pub fn create_agreement<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, CreateAgreement<'info>>,
        args: CreateAgreementArgs,
    ) -> Result<()> {
        let agreement = &mut ctx.accounts.agreement;

        agreement.version = 1;

        require!(
            args.guarantor_count == args.guarantors.len() as u8,
            GuarantorCountMismatch
        );
        agreement.guarantor_count = args.guarantor_count;

        let mut guarantor_arr = vec![];
        for guarantor in args.guarantors {
            let new_guarantor = Guarantor {
                wallet: guarantor,
                signed: 0,
                signed_at: None,
            };

            guarantor_arr.push(new_guarantor);
        }
        agreement.guarantors = guarantor_arr;

        agreement.title = args.title;
        agreement.content = args.content;

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
    pub content: String,
}

#[derive(Accounts)]
pub struct CreateAgreement<'info> {
    #[account(init, payer = payer, space = 1_000)]
    pub agreement: Box<Account<'info, Agreement>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
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
}
