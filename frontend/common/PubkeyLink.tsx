import { HiExternalLink } from 'react-icons/hi';
import { shortenAddress } from '../utils/basic';

interface Props {
  pubkey: string;
  customClass?: string;
}

export const PubkeyLink = ({ pubkey, customClass }: Props) => (
  <a
    href={`https://explorer.solana.com/address/${pubkey}`}
    target="_blank"
    rel="noopener noreferrer"
    className={
      'text-sm font-normal block whitespace-nowrap bg-transparent text-blueGray-700 w-full' +
      (customClass ? ` ${customClass}` : '')
    }
    onClick={(e) => e.preventDefault()}
  >
    {shortenAddress(pubkey)}{' '}
    <HiExternalLink className="inline align-sub text-lg" />
  </a>
);
