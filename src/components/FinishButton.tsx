import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontType } from "../helpers/theme";
import { eventButtonPush } from "../helpers/analytics";
import { ScreenWidth } from '../helpers/constants';

interface Props {
  handleFinish?: () => void;
  handleCourseFinish?: () => void;
  color: string;
}



const Timer: React.FC<Props> = ({ handleFinish, handleCourseFinish, color }: Props) => {
  const pressHandler = () => {
    eventButtonPush('finish');
    handleFinish && handleFinish();
    handleCourseFinish && handleCourseFinish();
  }
  return (
    <TouchableOpacity style={styles.button} onPress={pressHandler}>
      <Text allowFontScaling={false} style={styles.text}>FINISH</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 100,
    // right: 25,
    height: 40,
    width: 100,
    left: (ScreenWidth / 2) - 50,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 26,
    fontFamily: FontType.Medium,
    fontWeight: '400',
    color: 'white',

  }

});

export default Timer;