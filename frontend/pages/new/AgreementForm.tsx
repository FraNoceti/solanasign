import { useWallet } from '@solana/wallet-adapter-react';
import Router from 'next/router';
import { useState } from 'react';
import { ButtonSmall } from '../../common/ButtonSmall';
import { notify } from '../../common/Notification';
import useAgreement from '../../providers/AgreementProvider';
import { useEnvironmentCtx } from '../../providers/EnvironmentProvider';
import { createAgreement } from '../../utils/agreement';
import { getPublickeyArray, getURLWithNet } from '../../utils/basic';
import { asWallet } from '../../utils/web3';

function AgreementForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [signers, setSigners] = useState('');
  const { connection, environment } = useEnvironmentCtx();
  const wallet = useWallet();
  const { program, contracts } = useAgreement();

  const createContract = async () => {
    if (
      program &&
      wallet &&
      wallet.publicKey &&
      wallet.signAllTransactions &&
      wallet.signTransaction
    ) {
      if (title.trim() === '') {
        notify({
          message: 'Please input the title correctly',
          type: 'error'
        });
      } else if (content.trim() === '') {
        notify({
          message: 'Please input the content correctly',
          type: 'error'
        });
      } else if (signers.trim() === '') {
        notify({
          message: 'Please input the signer correctly',
          type: 'error'
        });
      } else {
        const result = await createAgreement(
          title,
          content,
          getPublickeyArray(signers),
          program,
          connection,
          asWallet(wallet)
        );
        if (result) {
          if (result) {
            notify({
              message: 'Successfully created a contract',
              type: 'success'
            });
          } else {
            notify({
              message: 'Failed to created a contract',
              type: 'error'
            });
          }
          contracts?.refetch();
          Router.push(getURLWithNet(environment.label, '/agreements'));
        }
      }
    } else {
      notify({
        message: 'Please connect the wallet',
        type: 'error'
      });
    }
  };

  return (
    <div className="block w-full overflow-x-auto p-4">
      <div className="font-bold text-blueGray-500 mb-3 flex justify-between">
        New Contract
        <ButtonSmall
          className="text-xs rounded outline-none bg-blueGray-700 text-white font-bold w-[100px]"
          onClick={() => {
            Router.push(getURLWithNet(environment.label, '/agreements'));
          }}
        >
          Back to list
        </ButtonSmall>
      </div>
      <div className="mb-3 pt-0">
        <input
          type="text"
          placeholder="Please input the title of the agreement"
          className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-3 pt-0">
        <textarea
          placeholder="Please input the content of the agreement"
          className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <div className="pt-0 w-[500px]">
          <input
            type="text"
            placeholder="Please input the address of signer"
            className="px-1 py-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"
            value={signers}
            onChange={(e) => setSigners(e.target.value)}
          />
        </div>
        <ButtonSmall
          className="text-xs rounded outline-none bg-blueGray-700 text-white font-bold w-[200px]"
          onClick={createContract}
        >
          Create
        </ButtonSmall>
      </div>
    </div>
  );
}

export default AgreementForm;
