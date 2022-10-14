/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

type ErrorWithCode = Error & { code: number }
type MaybeErrorWithCode = ErrorWithCode | null | undefined

const createErrorFromCodeLookup: Map<number, () => ErrorWithCode> = new Map()
const createErrorFromNameLookup: Map<string, () => ErrorWithCode> = new Map()

/**
 * GuarantorCountMismatch: 'Number of guarantors mismatch!'
 *
 * @category Errors
 * @category generated
 */
export class GuarantorCountMismatchError extends Error {
  readonly code: number = 0x1770
  readonly name: string = 'GuarantorCountMismatch'
  constructor() {
    super('Number of guarantors mismatch!')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, GuarantorCountMismatchError)
    }
  }
}

createErrorFromCodeLookup.set(0x1770, () => new GuarantorCountMismatchError())
createErrorFromNameLookup.set(
  'GuarantorCountMismatch',
  () => new GuarantorCountMismatchError()
)

/**
 * GuarantorDoesNotExist: 'Guarantor does not exist!'
 *
 * @category Errors
 * @category generated
 */
export class GuarantorDoesNotExistError extends Error {
  readonly code: number = 0x1771
  readonly name: string = 'GuarantorDoesNotExist'
  constructor() {
    super('Guarantor does not exist!')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, GuarantorDoesNotExistError)
    }
  }
}

createErrorFromCodeLookup.set(0x1771, () => new GuarantorDoesNotExistError())
createErrorFromNameLookup.set(
  'GuarantorDoesNotExist',
  () => new GuarantorDoesNotExistError()
)

/**
 * AccountNotProgramData: 'Account is not a program data!'
 *
 * @category Errors
 * @category generated
 */
export class AccountNotProgramDataError extends Error {
  readonly code: number = 0x1772
  readonly name: string = 'AccountNotProgramData'
  constructor() {
    super('Account is not a program data!')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, AccountNotProgramDataError)
    }
  }
}

createErrorFromCodeLookup.set(0x1772, () => new AccountNotProgramDataError())
createErrorFromNameLookup.set(
  'AccountNotProgramData',
  () => new AccountNotProgramDataError()
)

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
export function errorFromCode(code: number): MaybeErrorWithCode {
  const createError = createErrorFromCodeLookup.get(code)
  return createError != null ? createError() : null
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
export function errorFromName(name: string): MaybeErrorWithCode {
  const createError = createErrorFromNameLookup.get(name)
  return createError != null ? createError() : null
}
