import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Easing,
  StyleSheet,
} from 'react-native';
import LottieView from 'lottie-react-native';

const Content = ({navigation}) => {
  return <View style={styles.container} />;
};
export default Content;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  a: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  b: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  c: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonHolder: {
    height: 80,
  },
  button: {
    height: 50,
    width: 120,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato',
    alignSelf: 'center',
  },
});
