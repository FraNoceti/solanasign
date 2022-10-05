export const firstParam = (param: string | string[] | undefined): string => {
  if (!param) return '';
  return typeof param === 'string' ? param : param[0] || '';
};

export function shortenAddress(address: string, chars = 5): string {
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
}
