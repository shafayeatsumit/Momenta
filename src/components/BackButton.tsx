import React from 'react'
import { Animated, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { eventButtonPush } from "../helpers/analytics";

interface Props {
  handlePress: () => void;
  opacity?: any;
}

const BackButton: React.FC<Props> = ({ handlePress, opacity }: Props) => {
  const pressHandler = () => {
    eventButtonPush('back button')
    handlePress();
  }
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity onPress={pressHandler} style={styles.buttonContainer}>
        <Image source={require('../../assets/images/left_arrow_icon.png')} style={styles.icon} />
      </TouchableOpacity>
    </Animated.View >
  );
}

export default BackButton;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    left: 10,
    height: 50,
    width: 50,
    zIndex: 10,
  },
  buttonContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    paddingLeft: 10,
    // zIndex: 4,
    // backgroundColor: 'red',
  },
  icon: {
    tintColor: 'white',
    height: 20,
    width: 20,
    resizeMode: 'contain'
  }
});
