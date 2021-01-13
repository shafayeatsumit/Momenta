import React from 'react'
import { Animated, View, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface Props {
  handlePress: () => void;
  opacity?: any;
}

const BackButton: React.FC<Props> = ({ handlePress, opacity }: Props) => {
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity onPress={handlePress} style={styles.buttonContainer}>
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
    height: 20,
    width: 20,
    resizeMode: 'contain'
  }
});
