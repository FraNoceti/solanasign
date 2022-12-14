import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEnvironmentCtx } from '../providers/EnvironmentProvider';
import { getURLWithNet } from '../utils/basic';
import Layout from './layout';

const Home: NextPage = () => {
  const { environment } = useEnvironmentCtx();
  return (
    <Layout
      title="Solana Sign"
      description="Create and sign the agreement on solana blockchain"
    >
      <div className="container  mx-auto items-center flex flex-wrap bg-slate-800">
        <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
          <div className="pt-32 sm:pt-0">
            <h2 className="font-bold text-5xl text-slate-200">
              Peer to peer agreements<br></br> on the Solana Blockchain.
            </h2>
            <p className="mt-4 text-xl leading-relaxed text-slate-300 p">
              SolanaSign is a fully decentralized alternative to products<br></br> like
              DocuSign and EchoSign. Documents and the signatures<br></br> are stored on
              the Solana blockchain.
            </p>
            <div className="mt-12">
              <Link href={getURLWithNet(environment.label, '/new')}>
                <span className="cursor-pointer ml-20 get-started text-white font-bold px-6 py-3 rounded-xl outline-none focus:outline-none mr-1 mb-1 bg-orange-500 active:bg-blueGray-600 uppercase text-md shadow hover:shadow-lg ease-linear transition-all duration-150">
                  Create New
                </span>
              </Link>
              <Link href={getURLWithNet(environment.label, '/agreements')}>
                <span className="cursor-pointer ml-3 text-white font-bold px-6 py-3 rounded-xl outline-none focus:outline-none mr-1 mb-1 bg-orange-500 active:bg-blueGray-600 uppercase text-md shadow hover:shadow-lg">
                  My List
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="pl-10 absolute top-0 b-auto right-0 sm:w-6/12 -mt-48 sm:mt-0 w-10/12 h-full object-cover border-l-2 border-orange-500">
        <Image
          src="/backgrounds/Homepage-1.jpg"
          layout="fill"
          objectFit="cover"
          alt="..."
        />
      </div>
    </Layout>
  );
};

export default Home;
