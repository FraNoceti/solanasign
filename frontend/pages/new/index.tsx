import Layout from '../layout';
import AgreementForm from './AgreementForm';

function NewAgreement() {
  return (
    <Layout title="New Contract" description="Create a new contract">
      <div className="container mx-auto flex flex-wrap">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 mt-5 shadow-lg shadow-white rounded-3xl bg-slate-300 p-4">
          <AgreementForm />
        </div>
      </div>
    </Layout>
  );
}

export default NewAgreement;
