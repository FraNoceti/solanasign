import { HiCheck } from 'react-icons/hi';
import { ButtonSmall } from '../../common/ButtonSmall';

interface Props {
  sign: () => void;
  isSigned: boolean;
}

const ContractAction: React.FC<Props> = ({ sign, isSigned }: Props) => {
  return isSigned ? (
    <HiCheck className="text-lg" />
  ) : (
    <ButtonSmall
      className="text-xs rounded outline-none bg-blueGray-700 text-white font-bold"
      onClick={sign}
    >
      Sign
    </ButtonSmall>
  );
};

export default ContractAction;
