import { AgreementArgs, Guarantor } from '@agreement/js';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import { notify } from '../../common/Notification';
import { PubkeyLink } from '../../common/PubkeyLink';
import useAgreement, { Contract } from '../../providers/AgreementProvider';
import { useEnvironmentCtx } from '../../providers/EnvironmentProvider';
import { signAgreement } from '../../utils/agreement';
import { asWallet } from '../../utils/web3';
import ContractAction from './ContractAction';

interface Props {
  contracts: Contract[];
}

const ContractTable: React.FC<Props> = ({ contracts }: Props) => {
  const { connection } = useEnvironmentCtx();
  const wallet = useWallet();
  const { program } = useAgreement();
  const isSigned = (contract: Contract): boolean => {
    return (
      contract.data.guarantors.findIndex(
        (guarantor) =>
          guarantor.wallet.toString() === wallet?.publicKey?.toString() &&
          guarantor.signed === 1
      ) > -1
    );
  };

  const sign = async (contract: Contract): Promise<void> => {
    if (program && wallet) {
      await signAgreement(
        contract.pubkey,
        connection,
        program,
        asWallet(wallet)
      );
    } else {
      notify({
        message: 'Please connect the wallet',
        type: 'error'
      });
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
                    'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  }
                >
                  Title
                </th>
                <th
                  className={
                    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
                    'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  }
                >
                  Content
                </th>
                <th
                  className={
                    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
                    'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  }
                >
                  Number of signers
                </th>
                <th
                  className={
                    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
                    'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  }
                >
                  Signed
                </th>
                <th
                  className={
                    'px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ' +
                    'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  }
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {contracts.length > 0 ? (
                contracts.map((contract, index) => (
                  <tr key={`contract-${index}`}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <span className="font-bold text-blueGray-600 align-center">
                        {contract.data.title}
                      </span>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {contract.data.content}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {contract.data.guarantorCount}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {contract.data.guarantors.map(
                        (guarantor: Guarantor, pubkeyIndex: number) =>
                          guarantor.signed === 1 && (
                            <PubkeyLink
                              key={`pubkey-${index}-${pubkeyIndex}`}
                              pubkey={guarantor.wallet.toString()}
                            />
                          )
                      )}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                      <ContractAction
                        sign={() => sign(contract)}
                        disabled={wallet === null}
                        isSigned={isSigned(contract)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-2 font-semibold text-blueGray-500"
                  >
                    No Contract
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ContractTable;
