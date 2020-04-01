import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import Navigation from './src/navigation/Nav';
import rootReducer from './src/redux/reducers/index';

const store = createStore(rootReducer);

const App = () => (
  <Provider store={store}>
    <Navigation />
  </Provider>
);

export default App;
