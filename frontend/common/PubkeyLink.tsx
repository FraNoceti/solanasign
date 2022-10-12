import Link from 'next/link';
import { HiExternalLink } from 'react-icons/hi';
import { useEnvironmentCtx } from '../providers/EnvironmentProvider';
import { getExplorerURL, shortenAddress } from '../utils/basic';

interface Props {
  pubkey: string;
  customClass?: string;
}

export const PubkeyLink = ({ pubkey, customClass }: Props) => {
  const { environment } = useEnvironmentCtx();
  return (
    <Link
      href={getExplorerURL(
        environment.label,
        `https://explorer.solana.com/address/${pubkey}`
      )}
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={
          'text-sm font-normal block whitespace-nowrap bg-transparent text-blueGray-700 w-full mb-1' +
          (customClass ? ` ${customClass}` : '')
        }
      >
        {shortenAddress(pubkey)}{' '}
        <HiExternalLink className="inline align-sub text-lg" />
      </a>
    </Link>
  );
};
