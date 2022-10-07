import Head from 'next/head';
import Router from 'next/router';
import { ButtonSmall } from '../../common/ButtonSmall';
import Navbar from '../../components/Navbar';
import useAgreement from '../../providers/AgreementProvider';
import ContractTable from './ContractTable';

function Agreements() {
  const { contracts } = useAgreement();
  return (
    <>
      <Head>
        <title>My agreements</title>
        <meta name="description" content="The list of agreements" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <section className="relative pt-16 flex h-screen">
        <div className="container mx-auto">
          <div className="py-2 flex justify-between w-full">
            <div className="flex center font-semibold text-blueGray-500">
              Contracts
            </div>
            <ButtonSmall
              className="text-xs rounded outline-none bg-blueGray-700 text-white font-bold w-[100px]"
              onClick={() => {
                Router.push('/new');
              }}
            >
              Create New
            </ButtonSmall>
          </div>
          <ContractTable contracts={contracts} />
        </div>
      </section>
    </>
  );
}

export default Agreements;
