import React from 'react';
import {
  View,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
// import styles from './Content.styles';
import WaveView from '../../components/WaveView';

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      waterHeight: 0,
    };
  }

  startAnimation = () => {
    setInterval(() => {
      this.setState((state) => ({
        waterHeight: state.waterHeight + 1,
      }));
      this._waveRect.setWaterHeight(this.state.waterHeight);
    }, 500);
  };

  render() {
    console.log('water height', this.state.waterHeight);
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            // Stop Animation

            // set water baseline height
            this.startAnimation();
            // this._waveRect && this._waveRect.setWaterHeight(70);
          }}>
          <WaveView
            ref={(ref) => (this._waveRect = ref)}
            style={styles.waveBall}
            H={this.state.waterHeight}
            waveParams={[
              {A: 12, T: 220, fill: '#62c2ff'},
              {A: 15, T: 200, fill: '#0087dc'},
              // {A: 20, T: 180, fill: '#1aa7ff'},
            ]}
            animated={true}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  wave: {
    width: 100,
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  waveBall: {
    width: 150,
    // height:150,
    aspectRatio: 1,
    borderRadius: 75,
    overflow: 'hidden',
  },
});
