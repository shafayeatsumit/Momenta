import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// AsyncStorage.clear();
// TODO: need to adjust the whitelist
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userInfo', 'onboardingCompleted', 'settings'],
  stateReconciler: autoMergeLevel2,
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
