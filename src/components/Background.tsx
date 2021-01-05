import React from 'react'
import { View, ImageBackground, Animated, StyleSheet } from 'react-native';
import { ScreenHeight, ScreenWidth } from "../helpers/constants";
import { FontType } from "../helpers/theme";

interface Props {
  imagePath: string;
  innerCircleOpacity: any;
  innerCircleBackground: string;
}


const ExerciseBackground: React.FC<Props> = ({ imagePath, innerCircleOpacity, innerCircleBackground }: Props) => {

  return (
    <>

      <Animated.View style={[styles.absoluteContainer, { opacity: circleOpacity }]}>
        <View style={{ height: ScreenWidth * .56, width: ScreenWidth * .56, borderRadius: ScreenWidth * .28, backgroundColor: innerCircleBackground }} />
      </Animated.View>

      <View style={styles.absoluteContainer} >
        <View style={{ height: ScreenWidth * .7, width: ScreenWidth * .7, borderRadius: ScreenWidth * .35, backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />
      </View>

    </>
  );
}
export default ExerciseBackground;

const styles = StyleSheet.create({
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ScreenHeight * 0.6,
  },
  absoluteContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },

});
