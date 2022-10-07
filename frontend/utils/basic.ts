import { PublicKey } from '@solana/web3.js';

export const firstParam = (param: string | string[] | undefined): string => {
  if (!param) return '';
  return typeof param === 'string' ? param : param[0] || '';
};

export function shortenAddress(address: string, chars = 5): string {
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
}

export const tryPublicKey = (
  publicKeyString: PublicKey | string | string[] | undefined | null
): PublicKey | null => {
  if (publicKeyString instanceof PublicKey) return publicKeyString;
  if (!publicKeyString) return null;
  try {
    return new PublicKey(publicKeyString);
  } catch (e) {
    return null;
  }
};

export const getPublickeyArray = (signerStr: string): string[] => {
  return signerStr
    .trim()
    .split(' ')
    .filter((item) => item !== '')
    .map((item) => item.trim());
};
