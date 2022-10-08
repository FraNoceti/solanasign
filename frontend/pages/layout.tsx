import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';
import { VscTwitter } from 'react-icons/vsc';
import { SolanaLogo } from '../assets/SolanaLogo';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ title, description, children }: Props) => {
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

      <div className="flex flex-col h-screen">
        <Navbar />

        <section className="header relative pt-16 flex grow">
          {children}
        </section>

        <footer className={`${styles.footer} flex-none`}>
          <div className="container flex justify-between w-full">
            <div className="flex">
              <div className="mr-2 radius-lg bg-black w-[24px] h-[24px] rounded-full flex justify-center">
                <SolanaLogo />
              </div>
              Powered by Solana blockchain
            </div>
            <div className="flex justify-center items-center">
              Contact me:{' '}
              <Link
                className="cursor-pointer"
                href="https://twitter.com/davidlu_117"
                passHref
              >
                <a target="_blank" rel="noopener noreferrer">
                  <VscTwitter className="text-lg ml-2 text-[#1d9bf0]" />
                </a>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
