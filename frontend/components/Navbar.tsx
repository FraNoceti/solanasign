import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { ConnectedWallet } from '../common/ConnectedWallet';
import { WalletButton } from './WalletButton';

export default function Navbar() {
  const wallet = useWallet();
  const walletModal = useWalletModal();

  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href="/">
              <a
                className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
                href="#"
              >
                solanasign
              </a>
            </Link>
          </div>
          <div
            className="lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none"
            id="example-navbar-warning"
          >
            <ul className="flex flex-col lg:flex-row list-none mr-auto">
              <li className="flex items-center">
                <a
                  className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                  href="#"
                >
                  <HiOutlineDocumentText className="inline text-lg mr-1 text-blueGray-400" />
                  Docs
                </a>
              </li>
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
