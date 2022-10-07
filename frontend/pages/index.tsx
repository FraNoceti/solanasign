import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useEnvironmentCtx } from '../providers/EnvironmentProvider';
import styles from '../styles/Home.module.css';
import { getURLWithNet } from '../utils/basic';

const Home: NextPage = () => {
  const { environment } = useEnvironmentCtx();
  return (
    <>
      <Head>
        <title>Agreement on Solana</title>
        <meta
          name="description"
          content="Create and sign the agreement on solana blockchain"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <section className="header relative pt-16 items-center flex h-screen align-middle">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">
              <h2 className="font-semibold text-4xl text-blueGray-600">
                Peer to peer agreements on the Solana blockchain.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
                SolanaSign is a fully decentralized alternative to products like
                DocuSign and EchoSign. Documents and the signatures are stored
                on the Solana blockchain.
              </p>
              <div className="mt-12">
                <Link href={getURLWithNet(environment.label, '/new')}>
                  <span className="cursor-pointer get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-400 active:bg-blueGray-500 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150">
                    Create New
                  </span>
                </Link>
                <Link href={getURLWithNet(environment.label, '/agreements')}>
                  <span className="cursor-pointer ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg">
                    My List
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="pl-10 absolute top-0 b-auto right-0 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 h-full object-cover">
          <Image
            src="/backgrounds/index-back.jpg"
            layout="fill"
            objectFit="cover"
            alt="..."
          />
        </div>
      </section>

      <footer className={styles.footer}>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Copyright @ 2022 XXX Development Team
        </a>
      </footer>
    </>
  );
};

export default Home;
