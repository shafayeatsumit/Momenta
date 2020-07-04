import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

// AsyncStorage.clear();
// TODO: need to adjust the whitelist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userInfo', 'onboardingCompleted', 'settings'],
};
// const middleware = [logger, thunk];
const middleware = [thunk];

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(...middleware)),
  );
  let persistor = persistStore(store);
  return {store, persistor};
};
