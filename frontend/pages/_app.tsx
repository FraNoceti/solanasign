import '../styles/globals.css';
import '../styles/tailwind.css';
import type { AppProps } from 'next/app';
import {
  EnvironmentProvider,
  getInitialProps
} from '../providers/EnvironmentProvider';
import Wrapper from './wrapper';

require('@solana/wallet-adapter-react-ui/styles.css');

const App = ({
  Component,
  pageProps,
  cluster
}: AppProps & {
  cluster: string;
}) => (
  <EnvironmentProvider defaultCluster={cluster}>
    <Wrapper>
      <Component {...pageProps} />
    </Wrapper>
  </EnvironmentProvider>
);

App.getInitialProps = getInitialProps;

export default App;
