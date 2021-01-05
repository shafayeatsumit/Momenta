import React from 'react'
import { View, Animated, StyleSheet } from 'react-native';
import { ScreenWidth } from "../helpers/constants";

interface Props {
  circleOpacity: any;
  circleBackgroundColor: string;
}

const InnerCircle: React.FC<Props> = ({ circleOpacity, circleBackgroundColor }: Props) => {
  return (
    <Animated.View style={[styles.absoluteContainer, { opacity: circleOpacity }]}>
      <View style={{ height: ScreenWidth * .56, width: ScreenWidth * .56, borderRadius: ScreenWidth * .28, backgroundColor: circleBackgroundColor }} />
    </Animated.View>
  );
}

export default InnerCircle;

const styles = StyleSheet.create({
  absoluteContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  }
});
