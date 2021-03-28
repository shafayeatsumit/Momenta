import React from 'react'
import { View, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { eventButtonPush } from "../helpers/analytics";
import { ScreenHeight, ScreenWidth } from '../helpers/constants';

const Button = require('../../assets/images/pause_button.png');

interface Props {
  handlePause: () => void;
  buttonOpacity: any;
}

const PauseButton: React.FC<Props> = ({ handlePause, buttonOpacity }) => {
  const pressHandler = () => {
    eventButtonPush('pause');
    handlePause();
  }
  return (

    <TouchableOpacity style={[styles.PauseButton]} onPress={pressHandler}>
      <Animated.Image source={Button} resizeMode="contain" style={{ height: 70, width: 70, opacity: buttonOpacity ? buttonOpacity : 0.6 }} />
    </TouchableOpacity>

  );
}

export default PauseButton;

const styles = StyleSheet.create({


  PauseButton: {
    height: 80,
    width: 80,

    position: 'absolute',
    bottom: (ScreenHeight / 2) - 43,
    zIndex: 10,
    left: (ScreenWidth / 2) - 40,


  },
});
