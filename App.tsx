import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Test from "./src/screens/Test";
import Nav from "./src/navigation/Nav";
import * as Sentry from '@sentry/react-native';
import TrackPlayer from 'react-native-track-player';

if (!__DEV__) {
  Sentry.init({
    dsn:
      'https://f27128cba4cd43c9b168302811ec8a3d@o414961.ingest.sentry.io/5305328',
  });
}

TrackPlayer.setupPlayer();

// TrackPlayer.registerPlaybackService(() => require('./src/helpers/trackplayerServices.js'));

TrackPlayer.updateOptions({
  stopWithApp: false,
  // capabilities: [
  //   // TrackPlayer.CAPABILITY_PLAY,
  //   // TrackPlayer.CAPABILITY_PAUSE,
  //   // TrackPlayer.CAPABILITY_STOP,
  //   // TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
  //   // TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
  // ],
})


const App: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Nav />
    </PersistGate>
  </Provider>
);

export default App;
