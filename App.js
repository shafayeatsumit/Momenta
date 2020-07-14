import React from 'react';
import {Provider} from 'react-redux';
import Navigation from './src/navigation/Nav';
import PersistStore from './src/redux/store.js';
import {PersistGate} from 'redux-persist/integration/react';

import * as Sentry from '@sentry/react-native';

if (!__DEV__) {
  Sentry.init({
    dsn:
      'https://f27128cba4cd43c9b168302811ec8a3d@o414961.ingest.sentry.io/5305328',
  });
}

const {store, persistor} = PersistStore();
const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Navigation />
    </PersistGate>
  </Provider>
);

export default App;
