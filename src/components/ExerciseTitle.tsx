import React from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native';
import { FontType } from "../helpers/theme";
import _ from 'lodash';

interface Props {
  title: string;
  opacity?: any;
}

const ExerciseTitle: React.FC<Props> = ({ title, opacity }: Props) => {
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text allowFontScaling={false} style={styles.text}>
        {_.upperFirst(title)}
      </Text>
    </Animated.View>
  );
}
export default ExerciseTitle;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 35,
    height: 50,
    width: 200,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    fontSize: 26,
    fontFamily: FontType.SemiBold,
    lineHeight: 32,
    color: 'white',
    fontWeight: '700'
  }
});
