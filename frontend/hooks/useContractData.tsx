import { PublicKey } from '@solana/web3.js';
import { useQuery } from 'react-query';
import { useEnvironmentCtx } from '../providers/EnvironmentProvider';
import { Contract } from '../types/contract';
import { useWalletId } from './useWalletId';

export const useContractData = () => {
  const walletId = useWalletId();
  const { connection } = useEnvironmentCtx();

  return useQuery<Contract[] | undefined>(
    ['contractData', walletId?.toString()],
    async () => {
      return [
        {
          version: 1,
          guarantorCount: 0,
          guarantors: [
            {
              wallet: new PublicKey(
                'EBChStmk22RKNREGLrDsayngvXSeYgcQusLfYQtZdMr9'
              ),
              signed: 1
            },
            {
              wallet: new PublicKey(
                '91RpgaJHStJ1mBjQEU8yHsxWiJQ6n4shuwEyDUVQSwgz'
              ),
              signed: 0
            }
          ],
          title: 'test1',
          content: 'test content'
        },
        {
          version: 1,
          guarantorCount: 0,
          guarantors: [
            {
              wallet: new PublicKey(
                '91RpgaJHStJ1mBjQEU8yHsxWiJQ6n4shuwEyDUVQSwgz'
              ),
              signed: 1
            }
          ],
          title: 'test1',
          content: 'test content'
        }
      ];
    },
    {
      enabled: !!walletId
    }
  );
};
