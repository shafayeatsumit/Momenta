import React from 'react'
import { View, Animated, StyleSheet } from 'react-native';
import { ScreenWidth } from "../helpers/constants";
import Container from "../components/CenterContainer";
interface Props {
  circleOpacity: any;
  circleBackgroundColor: string;
}

const InnerCircle: React.FC<Props> = ({ circleOpacity, circleBackgroundColor }: Props) => {
  return (
    <Container>
      <View style={{ height: ScreenWidth * .2, width: ScreenWidth * .2, borderRadius: ScreenWidth * .1, backgroundColor: circleBackgroundColor }} />
    </Container>
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
