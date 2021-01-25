import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { FontType } from '../helpers/theme';

interface Props {
  calibrationComplete: boolean
}

const CalibrationComplete: React.FC<Props> = ({ calibrationComplete }) => {
  const animationValue = useRef(new Animated.Value(0)).current;

  const fadeInText = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (calibrationComplete) {
      fadeInText();
    }

  }, [calibrationComplete])
  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: animationValue }]}>
        Calibrated to you
    </Animated.Text>

    </View>
  );
}

export default CalibrationComplete;


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 210,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 22,
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    color: 'white',
  }

});
