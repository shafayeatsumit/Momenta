import React from 'react'
import { View, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { eventButtonPush } from "../helpers/analytics";

const playButton = require('../../assets/images/play_button.png');

interface Props {
  handleStart: () => void;
  buttonOpacity: any;

}

const PlayButton: React.FC<Props> = ({ handleStart, buttonOpacity }) => {
  const pressHandler = () => {
    handleStart();
    eventButtonPush('play');
  }
  return (
    <Animated.View style={styles.absoluteContainer}>
      <TouchableOpacity style={[styles.playButton]} onPress={pressHandler}>
        <Animated.Image source={playButton} resizeMode="contain" style={{ height: 70, width: 70, opacity: buttonOpacity }} />
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
    paddingLeft: 6
  },
});
