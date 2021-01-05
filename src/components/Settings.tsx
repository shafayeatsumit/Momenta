import React from 'react'
import { View, Animated, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  opacity: any;
}


const ExerciseSettings: React.FC<Props> = ({ opacity, }) => {
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity onPress={() => console.log('back icon')} style={styles.button}>
        <Image source={require('../../assets/images/settings_icon.png')} style={{ tintColor: 'white', height: 25, width: 25, resizeMode: 'contain' }} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default ExerciseSettings;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 25,
    height: 50,
    width: 50,
    zIndex: 5,

  },
  button: {
    height: 50,
    width: 50,
  }

});
