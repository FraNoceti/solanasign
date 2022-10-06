/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as web3 from '@solana/web3.js'
import * as beet from '@metaplex-foundation/beet'
import * as beetSolana from '@metaplex-foundation/beet-solana'
export type CreateAgreementArgs = {
  guarantorCount: number
  guarantors: web3.PublicKey[]
  title: string
  content: string
}

/**
 * @category userTypes
 * @category generated
 */
export const createAgreementArgsBeet =
  new beet.FixableBeetArgsStruct<CreateAgreementArgs>(
    [
      ['guarantorCount', beet.u8],
      ['guarantors', beet.array(beetSolana.publicKey)],
      ['title', beet.utf8String],
      ['content', beet.utf8String],
    ],
    'CreateAgreementArgs'
  )
