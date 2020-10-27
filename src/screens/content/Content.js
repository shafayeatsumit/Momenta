import React, {useState} from 'react';
import {
  View,
  Dimensions,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  NativeModules,
  Platform,
  Slider,
  StyleSheet,
  Alert,
} from 'react-native';
// import styles from './Content.styles';
import {Colors, FontType} from '../../helpers/theme';
import WaveView from '../../components/WaveView';

const Content = (props) => {
  const [apmlitude, setAmplitude] = useState(20);
  const androidVibrate = () => {
    Platform.OS === 'android' &&
      NativeModules.AndroidVibration.show(2000, apmlitude);
  };
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Slider
          value={apmlitude}
          style={{
            height: 50,
            width: 220,
            alignSelf: 'center',
          }}
          minimumValue={5}
          maximumValue={255}
          step={5}
          onValueChange={(value) => setAmplitude(value)}
        />
        <Text style={styles.txt}>Intensity: {apmlitude}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={androidVibrate}>
        <Text style={styles.txt}>Click</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Content;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 22,
  },
  topContainer: {
    height: 300,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
});
