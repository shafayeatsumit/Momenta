import React from 'react'
import { View, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { eventButtonPush } from "../helpers/analytics";
import { ScreenHeight, ScreenWidth } from '../helpers/constants';

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

    <TouchableOpacity style={[styles.playButton]} onPress={pressHandler}>
      <Animated.Image source={playButton} resizeMode="contain" style={{ height: 70, width: 70, opacity: buttonOpacity }} />
    </TouchableOpacity>


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
    // backgroundColor: 'red',
    position: 'absolute',
    bottom: (ScreenHeight / 2) - 45,
    zIndex: 10,
    left: (ScreenWidth / 2) - 40,
    paddingLeft: 8,



  },
});
