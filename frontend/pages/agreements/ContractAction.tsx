import { HiCheck } from 'react-icons/hi';
import { ButtonSmall } from '../../common/ButtonSmall';

interface Props {
  sign: () => Promise<void>;
  isSigned: boolean;
  disabled: boolean;
}

const ContractAction: React.FC<Props> = ({
  sign,
  isSigned,
  disabled
}: Props) => {
  return isSigned ? (
    <HiCheck className="text-lg" />
  ) : (
    <ButtonSmall
      className="text-xs rounded outline-none bg-blueGray-700 text-white font-bold"
      onClick={sign}
      disabled={disabled}
    >
      Sign
    </ButtonSmall>
  );
};

export default ContractAction;
