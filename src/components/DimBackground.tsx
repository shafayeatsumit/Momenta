import React, { useEffect, useRef } from 'react'
import { Animated, View, Easing, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { eventButtonPush } from "../helpers/analytics";

interface Props {
  exerciseState: any
}

const DimBackground: React.FC<Props> = ({ exerciseState }: Props) => {
  const dimOpacity = useRef(new Animated.Value(0)).current;

  const dimBackground = () => {
    Animated.timing(dimOpacity, {
      toValue: 0.5,
      duration: 1000,
      delay: 0,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  const resetBackground = () => {
    dimOpacity.setValue(0);
  }

  useEffect(() => {
    console.log('dim background ', exerciseState);
    if (exerciseState === 'playing') {
      dimBackground();
    }
    if (exerciseState === 'paused') {
      resetBackground();
    }

  }, [exerciseState])

  return (
    <Animated.View style={[styles.container, { opacity: dimOpacity }]} />
  );
}

export default DimBackground;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,1)',
  }
});
