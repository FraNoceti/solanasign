import { PubkeyLink } from '../../common/PubkeyLink';
import { useWalletId } from '../../hooks/useWalletId';
import { Contract } from '../../types/contract';
import { ContractAction } from './ContractAction';

interface Props {
  contracts: Contract[];
}

export const ContractTable = ({ contracts }: Props) => {
  const walletId = useWalletId();
  const isSigned = (contract: Contract): boolean => {
    return (
      contract.guarantors.findIndex(
        (guarantor) =>
          guarantor.wallet.toString() === walletId?.toString() &&
          guarantor.signed === 1
      ) > -1
    );
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <div className="block w-full overflow-x-auto mt-3">
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
              {contracts.map((contract, index) => (
                <tr key={`contract-${index}`}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <span className="font-bold text-blueGray-600 align-center">
                      {contract.title}
                    </span>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {contract.content}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {contract.guarantorCount}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {contract.guarantors.map(
                      (guarantor, pubkeyIndex) =>
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
                      sign={() => {}}
                      isSigned={isSigned(contract)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
