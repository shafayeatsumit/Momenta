import React from 'react'
import { Animated, View, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  opacity: any;
  handlePress: () => void;
}

const ExerciseInfo: React.FC<Props> = ({ opacity, handlePress }: Props) => {
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity onPress={handlePress} style={styles.buttonContainer}>
        <Image source={require('../../assets/images/info_icon.png')} style={styles.icon} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    right: 20,
    height: 50,
    width: 50,
    zIndex: 5,
  },
  buttonContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  icon: {
    tintColor: 'white',
    height: 20,
    width: 20,
    resizeMode: 'contain'
  }

});


export default ExerciseInfo;