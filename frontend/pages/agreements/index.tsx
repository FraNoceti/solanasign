import Head from 'next/head';
import Navbar from '../../components/Navbar';
import useAgreement from '../../providers/AgreementProvider';
import { ContractTable } from './ContractTable';

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
        <div className="container mx-auto flex flex-wrap">
          <ContractTable contracts={contracts} />
        </div>
      </section>
    </>
  );
}

export default Agreements;
