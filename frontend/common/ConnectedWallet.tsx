import { PublicKey } from '@solana/web3.js';
import { shortenAddress } from './utils';
import { createPopper } from '@popperjs/core';
import React, { useRef } from 'react';
import { WalletButton } from '../components/WalletButton';
import { HiExternalLink } from 'react-icons/hi';

interface Props {
  wallet: PublicKey;
  handleDisconnect: () => void;
}

export const ConnectedWallet: React.FC<Props> = ({
  wallet,
  handleDisconnect
}: Props) => {
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = useRef<HTMLAnchorElement>(null);
  const popoverDropdownRef = useRef<HTMLDivElement>(null);
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current!, popoverDropdownRef.current!, {
      placement: 'bottom'
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <WalletButton
            caption={shortenAddress(wallet.toString())}
            handler={() => {}}
          />
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          'bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48'
        }
      >
        <a
          href={`https://explorer.solana.com/address/${wallet.toString()}`}
          target="_blank"
          rel="noopener noreferrer"
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          onClick={(e) => e.preventDefault()}
        >
          {shortenAddress(wallet.toString())}{' '}
          <HiExternalLink className="inline" />
        </a>
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <a
          href="#pablo"
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          onClick={handleDisconnect}
        >
          Disconnect
        </a>
      </div>
    </>
  );
};
