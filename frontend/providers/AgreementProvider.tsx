import { useQuery } from 'react-query';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useProgram } from '../hooks/useProgram';
import { useProvider } from '../hooks/useProvider';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { Agreement as AgreementProgram } from '../types/agreement';
import { AgreementArgs } from '@agreement/js';

export function _useAgreement() {
  const provider = useProvider();
  const program = useProgram(provider);

  const contracts = useQuery(
    ['contracts'],
    async () => {
      const allAgreements = await program?.account.agreement.all();
      return allAgreements?.map((item) => item.account as AgreementArgs) ?? [];
    },
    { enabled: !!program }
  );

  return {
    provider,
    program,
    contracts: contracts.data || []
  };
}

export interface AgreementContextValues {
  provider: AnchorProvider | null;
  program: Program<AgreementProgram> | null;
  contracts: AgreementArgs[];
}

export const AgreementContext = createContext<AgreementContextValues>({
  provider: null,
  program: null,
  contracts: []
});

export function AgreementProvider({ children }: { children?: ReactNode }) {
  const agreement = _useAgreement();

  return (
    <AgreementContext.Provider value={agreement}>
      {children}
    </AgreementContext.Provider>
  );
}

export default function useAgreement() {
  return useContext(AgreementContext);
}
