import React, {useState} from 'react';
import {
  View,
  Dimensions,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';

const Content = () => {
  const imageOpacity = new Animated.Value(0);
  const blurImageOpacity = new Animated.Value(1);
  const imageScale = new Animated.Value(0);
  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(imageOpacity, {
        toValue: 1,
        delay: 2000,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(blurImageOpacity, {
        toValue: 0,
        delay: 3000,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]).start(reverseAnimation);
  };
  const reverseAnimation = () => {
    Animated.parallel([
      Animated.timing(imageOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(blurImageOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 0,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]).start(startAnimation);
  };
  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../assets/images/gradient_circle.png')}
        style={[
          styles.image,
          {
            transform: [{scale: imageScale}],
            opacity: imageOpacity,
          },
        ]}
        onLoadEnd={startAnimation}
      />
      <Animated.Image
        source={require('../../../assets/images/gradient_blurry_two.png')}
        style={[
          styles.imageBlurry,
          {
            transform: [{scale: imageScale}],
            opacity: blurImageOpacity,
          },
        ]}
      />
    </View>
  );
};
export default Content;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    height: 200,
    width: 200,
    borderRadius: 100,
  },
  imageBlurry: {
    position: 'absolute',
    height: 200,
    width: 200,
    borderRadius: 100,
    zIndex: 5,
  },
});
