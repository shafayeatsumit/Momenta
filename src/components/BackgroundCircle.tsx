import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { ScreenWidth } from "../helpers/constants";
import Container from "../components/CenterContainer";
interface Props {
  opacity: Animated.Value;
}

const BackgroundCircle: React.FC<Props> = ({ opacity }: Props) => {
  return (
    <Container>
      <Animated.View style={[styles.circle, { opacity: opacity }]} />
    </Container>
  );
}

export default BackgroundCircle;

const styles = StyleSheet.create({
  circle: {
    height: ScreenWidth * .4, width: ScreenWidth * .4, borderRadius: ScreenWidth * .2, backgroundColor: 'rgba(0, 0, 0, 0.3)'
  }
});
