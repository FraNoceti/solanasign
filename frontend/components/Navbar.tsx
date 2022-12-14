import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { ConnectedWallet } from '../common/ConnectedWallet';
import { useEnvironmentCtx } from '../providers/EnvironmentProvider';
import { getURLWithNet } from '../utils/basic';
import { WalletButton } from './WalletButton';

export default function Navbar() {
  const wallet = useWallet();
  const walletModal = useWalletModal();
  const { environment } = useEnvironmentCtx();

  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-slate-800 border-b-2 border-slate-600">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href={getURLWithNet(environment.label, '/')}>
              <a
                className="text-orange-500 text-md font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
                href="#"
              >
                solanasign
              </a>
            </Link>
          </div>
          <div
            className="lg:flex flex-grow items-center lg:bg-opacity-0 lg:shadow-none"
            id="example-navbar-warning"
          >
            <ul className="flex flex-col lg:flex-row list-none mr-auto">
              <li className="flex items-center">
                <a
                  className="hover:text-blueGray-500 text-blueGray-400 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                  href="#"
                >
                  <HiOutlineDocumentText className="inline text-lg mr-1 text-blueGray-300" />
                  Docs
                </a>
              </li>
              {environment.label !== 'mainnet-beta' && (
                <li className="flex items-center">
                  <div
                    className="bg-slate-300 px-2 rounded-lg "
                  >
                    {environment.label}
                  </div>
                </li>
              )}
            </ul>
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {wallet.connected && wallet.publicKey ? (
                <ConnectedWallet
                  wallet={wallet.publicKey}
                  handleDisconnect={() => wallet.disconnect()}
                />
              ) : (
                <WalletButton
                  caption="Connect wallet"
                  handler={() => walletModal.setVisible(true)}
                />
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
