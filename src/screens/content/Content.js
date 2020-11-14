import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Easing,
  StyleSheet,
} from 'react-native';
import LottieView from 'lottie-react-native';

const Content = ({navigation}) => {
  const animatedProgress = new Animated.Value(0);

  const shrink = () => {
    Animated.timing(animatedProgress, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
    }).start(expand);
  };

  const expand = () => {
    Animated.timing(animatedProgress, {
      toValue: 0.5,
      duration: 4000,
      easing: Easing.linear,
    }).start(shrink);
  };

  useEffect(() => {
    shrink();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.a}>
        <LottieView
          source={require('../../../assets/anims/breath.json')}
          progress={animatedProgress}
          style={styles.lottieFile}
        />
      </View>
      <View style={styles.b}>
        <LottieView
          source={require('../../../assets/anims/breath_later_opacity.json')}
          progress={animatedProgress}
          style={styles.lottieFile}
        />
      </View>
      <View style={styles.c}>
        <LottieView
          source={require('../../../assets/anims/breath_two_sec.json')}
          progress={animatedProgress}
          style={styles.lottieFile}
        />
      </View>
      <View style={styles.buttonHolder}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.text}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Content;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  a: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  b: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  c: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonHolder: {
    height: 80,
  },
  button: {
    height: 50,
    width: 120,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'tomato',
    alignSelf: 'center',
  },
});
