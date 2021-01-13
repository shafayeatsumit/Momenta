import React from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native';
import { FontType } from "../helpers/theme";
interface Props {
  title: string;
  opacity?: any;
}

const ExerciseTitle: React.FC<Props> = ({ title, opacity }: Props) => {
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>
        {title}
      </Text>
    </Animated.View>
  );
}
export default ExerciseTitle;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    height: 50,
    width: 130,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    fontSize: 26,
    fontFamily: FontType.Regular,
    lineHeight: 32,
    color: 'white',
    fontWeight: '700'
  }
});
