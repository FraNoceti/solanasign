import { Guarantor } from '@agreement/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { sign } from 'crypto';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { ButtonSmall } from '../../common/ButtonSmall';
import { notify } from '../../common/Notification';
import { PubkeyLink } from '../../common/PubkeyLink';
import Navbar from '../../components/Navbar';
import { useProgram } from '../../hooks/useProgram';
import { useProvider } from '../../hooks/useProvider';
import { useEnvironmentCtx } from '../../providers/EnvironmentProvider';
import {
  alreadySigned,
  getAgreementData,
  signAgreement
} from '../../utils/agreement';
import { getURLWithNet } from '../../utils/basic';
import { asWallet } from '../../utils/web3';

const AgreementDetail: React.FC = () => {
  const provider = useProvider();
  const program = useProgram(provider);
  const router = useRouter();
  const wallet = useWallet();
  const { address } = router.query;
  const { environment, connection } = useEnvironmentCtx();
  const detailQuery = useQuery(
    ['contact-detail'],
    () => getAgreementData(program!, address! as string),
    { enabled: !!program && !!address }
  );

  const isSigned = useMemo(
    () =>
      !!detailQuery.data &&
      !!wallet &&
      alreadySigned(detailQuery.data, wallet.publicKey),
    [detailQuery.data, wallet]
  );

  const sign = async (): Promise<void> => {
    if (program && wallet) {
      await signAgreement(
        new PublicKey(address! as string),
        connection,
        program,
        asWallet(wallet)
      );
      notify({
        message: 'Successfully signed',
        type: 'success'
      });
      detailQuery?.refetch();
    } else {
      notify({
        message: 'Please connect the wallet',
        type: 'error'
      });
    }
  };

  return (
    <>
      <Head>
        <title>Contract Detail</title>
        <meta name="description" content="Contract Detail" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <section className="relative pt-16 flex h-screen">
        <div className="container mx-auto">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white p-4">
            {detailQuery.data && (
              <>
                <div className="rounded-md p-2 flex justify-between">
                  <span className="text-blueGray-700 font-bold self-center">
                    {detailQuery.data.title}
                  </span>
                  <ButtonSmall
                    className="text-xs rounded outline-none bg-blueGray-700 text-white font-bold w-[100px]"
                    onClick={() => {
                      router.push(
                        getURLWithNet(environment.label, '/agreements')
                      );
                    }}
                  >
                    Back to list
                  </ButtonSmall>
                </div>
                <div className="rounded-sm m-2 p-2 border-[1px] border-slate-300">
                  <span className="text-blueGray-500">Content :</span>
                  <div className="whitespace-pre-wrap">
                    {detailQuery.data.content}
                  </div>
                </div>
                <div className="flex justify-between p-2">
                  <div>
                    <div className="mb-1">Signers</div>
                    {detailQuery.data.guarantors.map(
                      (guarantor: Guarantor, pubkeyIndex: number) =>
                        guarantor.signed === 1 && (
                          <PubkeyLink
                            key={`pubkey-${pubkeyIndex}`}
                            pubkey={guarantor.wallet.toString()}
                          />
                        )
                    )}
                  </div>
                  <div>
                    <ButtonSmall
                      className="text-xs rounded outline-none text-white font-bold "
                      onClick={sign}
                      disabled={isSigned}
                    >
                      {isSigned ? 'Signed' : 'Sign'}
                    </ButtonSmall>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AgreementDetail;
