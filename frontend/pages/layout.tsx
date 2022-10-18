import Head from 'next/head';
import { ReactNode } from 'react';
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
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <section className="header relative pt-16 flex grow bg-slate-800">
          {children}
        </section>

        <footer className={`${styles.footer} flex-none bg-slate-800 `}>
          <div className="container flex justify-between w-full bg-slate-800">
            <div className="flex text-slate-300">
              <div className="mr-2 radius-lg bg-slate-300 w-[24px] h-[24px] rounded-full flex justify-center">
                <SolanaLogo />
              </div>
              Powered by Solana blockchain
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
