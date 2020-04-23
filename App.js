import React from 'react';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import Navigation from './src/navigation/Nav';
import rootReducer from './src/redux/reducers/index';
import {composeWithDevTools} from 'redux-devtools-extension';
import logger from 'redux-logger';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger)),
);

const App = () => (
  <Provider store={store}>
    <Navigation />
  </Provider>
);

export default App;
