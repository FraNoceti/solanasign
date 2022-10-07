import Head from 'next/head';
import Navbar from '../../components/Navbar';
import AgreementForm from './AgreementForm';

function NewAgreement() {
  return (
    <>
      <Head>
        <title>New Contract</title>
        <meta name="description" content="Create new agreemtn" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <section className="relative pt-16 flex h-screen">
        <div className="container mx-auto flex flex-wrap">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white p-4">
            <AgreementForm />
          </div>
        </div>
      </section>
    </>
  );
}

export default NewAgreement;
