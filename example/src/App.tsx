// @ts-nocheck
import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
// @ts-ignore
import PeerClientApp from './PeerClient'
import ClientApp from './Client'

export default function App() {
  // const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {

  }, []);

  return (
    <> 
    {/* <PeerClientApp/> */}
 <ClientApp/>
 </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
