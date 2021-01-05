import React from 'react'
import { View, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
const playButton = require('../../assets/images/play_button.png');

interface Props {
  handleStart: () => void;
  buttonOpacity: any;

}

const PlayButton: React.FC<Props> = ({ handleStart, buttonOpacity }) => {
  return (
    <Animated.View style={[styles.absoluteContainer, { opacity: buttonOpacity }]}>
      <TouchableOpacity style={[styles.playButton, { zIndex: 8 }]} onPress={handleStart}>
        <Image source={playButton} resizeMode="contain" style={{ height: 70, width: 70 }} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default PlayButton;

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
  playButton: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
});
