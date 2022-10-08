import Head from 'next/head';
import Router from 'next/router';
import { ButtonSmall } from '../../common/ButtonSmall';
import Navbar from '../../components/Navbar';
import useAgreement from '../../providers/AgreementProvider';
import { useEnvironmentCtx } from '../../providers/EnvironmentProvider';
import { getURLWithNet } from '../../utils/basic';
import Layout from '../layout';
import ContractTable from './ContractTable';

function Agreements() {
  const { environment } = useEnvironmentCtx();

  return (
    <Layout title="Contract List" description="The list of contracts">
      <div className="container mx-auto">
        <div className="py-2 flex justify-between w-full">
          <div className="flex center font-semibold text-blueGray-500">
            Contracts
          </div>
          <ButtonSmall
            className="text-xs rounded outline-none bg-blueGray-700 text-white font-bold w-[100px]"
            onClick={() => {
              Router.push(getURLWithNet(environment.label, '/new'));
            }}
          >
            Create New
          </ButtonSmall>
        </div>
        <ContractTable />
      </div>
    </Layout>
  );
}

export default Agreements;
