import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(
    persistedReducer,
    // composeWithDevTools(applyMiddleware(logger)),
  );
  let persistor = persistStore(store);
  return {store, persistor};
};
