import React from 'react'
import { View, Animated, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { ScreenHeight, ScreenWidth } from "../helpers/constants";
interface Props {
  animationFile: any;
  animatedProgress: any;
  name?: string;
}

const AnimatedProgress: React.FC<Props> = ({ animationFile, name, animatedProgress }: Props) => {
  const file = name === 'box' ?
    require('../../assets/anims/box.json')
    : require('../../assets/anims/breath.json')
  return (
    <View style={styles.container}>
      <LottieView
        source={file}
        style={styles.lottieFile}
        progress={animatedProgress}
        resizeMode="cover"
      />
    </View>
  );
}

export default AnimatedProgress;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieFile: {
    height: ScreenWidth * .8,
    width: ScreenWidth * .8,
  },
});
