import React from 'react'
import { View, Animated, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { eventButtonPush } from "../helpers/analytics";

interface Props {
  opacity: any;
  handlePress: () => void;
}


const ExerciseSettings: React.FC<Props> = ({ opacity, handlePress }) => {
  const pressHandler = () => {
    eventButtonPush('see_settings');
    handlePress();
  }
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity onPress={pressHandler} style={styles.button}>
        <Image source={require('../../assets/images/settings_icon.png')} style={{ tintColor: 'white', height: 25, width: 25, resizeMode: 'contain' }} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default ExerciseSettings;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 25,
    height: 50,
    width: 50,
    zIndex: 5,
    // backgroundColor: 'red',
  },
  button: {
    height: 50,
    width: 50,
    justifyContent: 'center',
  }

});
