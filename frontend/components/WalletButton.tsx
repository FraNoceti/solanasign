import { GlyphWallet } from '../assets/GlyphWallet';
import { ButtonSmall } from '../common/ButtonSmall';

interface Props {
  caption: string;
  handler: () => void;
}

export const WalletButton: React.FC<Props> = ({ caption, handler }: Props) => (
  <ButtonSmall
    className="text-xs rounded outline-none bg-orange text-white font-bold"
    onClick={handler}
  >
    <>
      <GlyphWallet />
      {caption}
    </>
  </ButtonSmall>
);
