import { useQuery, UseQueryResult } from 'react-query';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useProgram } from '../hooks/useProgram';
import { useProvider } from '../hooks/useProvider';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { Agreement as AgreementProgram } from '../types/agreement';
import { AgreementArgs } from '@agreement/js';
import { PublicKey } from '@solana/web3.js';

export type Contract = {
  pubkey: PublicKey;
  data: AgreementArgs;
};

export function _useAgreement() {
  const provider = useProvider();
  const program = useProgram(provider);

  const contracts = useQuery(
    ['contracts'],
    async () => {
      const allAgreements = await program?.account.agreement.all();
      const contracts: Contract[] =
        allAgreements?.map((item) => {
          return {
            pubkey: item.publicKey,
            data: item.account as AgreementArgs
          };
        }) ?? [];
      return contracts.filter(
        (item) =>
          item.data.guarantors.findIndex(
            (guarantor) =>
              guarantor.wallet.toString() ===
              provider?.wallet.publicKey.toString()
          ) > -1
      );
    },
    { enabled: !!program && !!provider && !!provider.wallet }
  );

  return {
    provider,
    program,
    contracts
  };
}

export interface AgreementContextValues {
  provider: AnchorProvider | null;
  program: Program<AgreementProgram> | null;
  contracts: UseQueryResult<Contract[]> | null;
}

export const AgreementContext = createContext<AgreementContextValues>({
  provider: null,
  program: null,
  contracts: null
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
