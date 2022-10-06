import Head from 'next/head';
import Navbar from '../../components/Navbar';
import { useContractData } from '../../hooks/useContractData';
import { ContractTable } from './ContractTable';

function Agreements() {
  const contracts = useContractData();
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
          <ContractTable contracts={contracts.data || []} />
        </div>
      </section>
    </>
  );
}

export default Agreements;
