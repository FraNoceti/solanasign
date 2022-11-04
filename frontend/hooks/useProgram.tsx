import { AnchorProvider } from '@project-serum/anchor';
import { useMemo } from 'react';
import * as anchor from '@project-serum/anchor';
import { Agreement as AgreementProgram, IDL } from '../types/agreement';
import { PROGRAM_ID } from '@agreement/js';

export const useProgram = (provider: AnchorProvider | null) => {
  return useMemo(
    () =>
      provider
        ? new anchor.Program<AgreementProgram>(IDL, PROGRAM_ID, provider)
        : null,
    [provider]
  );
};
