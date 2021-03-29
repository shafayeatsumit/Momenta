import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-community/async-storage';
import { rootReducers } from "../reducers";

// AsyncStorage.clear();

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'user', 'guidedPracticeSettings',
    'backgroundMusic', 'fetchCompleted',
    'settings', 'contentSettings'
  ],
};

const middleware = [thunk];
const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = createStore(persistedReducer, applyMiddleware(thunk))
export let persistor = persistStore(store);






