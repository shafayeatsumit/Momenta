import React from 'react'
import { Animated, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { eventButtonPush } from "../helpers/analytics";
import { ScreenHeight } from '../helpers/constants';

interface Props {
  handlePress: () => void;
  opacity?: any;
}

const ForwardButton: React.FC<Props> = ({ handlePress, opacity }: Props) => {
  const pressHandler = () => {
    eventButtonPush('back button')
    handlePress();
  }
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity onPress={pressHandler} style={styles.buttonContainer}>
        <Image source={require('../../assets/images/right_arrow_icon.png')} style={styles.icon} />
      </TouchableOpacity>
    </Animated.View >
  );
}

export default ForwardButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: ScreenHeight / 2 - 25,
    right: 20,
    height: 70,
    width: 50,
    zIndex: 5,
  },
  buttonContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    // backgroundColor: 'red',
  },
  icon: {
    tintColor: 'white',
    height: 30,
    width: 30,
    resizeMode: 'contain'
  }
});
