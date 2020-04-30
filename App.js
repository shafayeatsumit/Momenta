import React from 'react';
import {Provider} from 'react-redux';
import Navigation from './src/navigation/Nav';
import PersistStore from './src/redux/store.js';
import {PersistGate} from 'redux-persist/integration/react';
const {store, persistor} = PersistStore();
console.log('store', store, persistor);
const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Navigation />
    </PersistGate>
  </Provider>
);

export default App;
