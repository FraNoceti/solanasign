/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
export type UpdateAgreementArgs = {
  offset: number
  length: number
  content: Uint8Array
}

/**
 * @category userTypes
 * @category generated
 */
export const updateAgreementArgsBeet =
  new beet.FixableBeetArgsStruct<UpdateAgreementArgs>(
    [
      ['offset', beet.u32],
      ['length', beet.u32],
      ['content', beet.bytes],
    ],
    'UpdateAgreementArgs'
  )
