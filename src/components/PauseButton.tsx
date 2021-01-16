import React from 'react'
import { View, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
const Button = require('../../assets/images/pause_button.png');

interface Props {
  handlePause: () => void;
  buttonOpacity: any;
}

const PauseButton: React.FC<Props> = ({ handlePause, buttonOpacity }) => {
  console.log('button opacity', buttonOpacity);
  return (
    <Animated.View style={styles.absoluteContainer}>
      <TouchableOpacity style={[styles.PauseButton]} onPress={handlePause}>
        <Animated.Image source={Button} resizeMode="contain" style={{ height: 70, width: 70, opacity: buttonOpacity ? buttonOpacity : 0.6 }} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default PauseButton;

const styles = StyleSheet.create({

  absoluteContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  PauseButton: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
    // paddingLeft: 6
  },
});
