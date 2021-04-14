import React from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native';
import { FontType } from "../helpers/theme";
import _ from 'lodash';

interface Props {
  title: string;
  opacity?: any;
  containerStyle?: any;
  textStyle?: any;
}

const ExerciseTitle: React.FC<Props> = ({ title, opacity, containerStyle, textStyle }: Props) => {
  return (
    <Animated.View style={[styles.container, containerStyle, { opacity }]}>
      <Text allowFontScaling={false} style={[styles.text, textStyle]}>
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
    textAlign: 'center',
    // backgroundColor: 'red',
    paddingVertical: 5,
    // height: 50,
    width: 230,
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    fontSize: 24,
    fontFamily: FontType.SemiBold,
    lineHeight: 32,
    color: 'white',
    // fontWeight: '700'
  }
});
