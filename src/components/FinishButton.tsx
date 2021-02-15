import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontType } from "../helpers/theme";
import { eventButtonPush } from "../helpers/analytics";

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
    <TouchableOpacity style={[styles.button, handleCourseFinish && { left: 0, right: 0, alignSelf: 'center' }]} onPress={pressHandler}>
      <Text allowFontScaling={false} style={[styles.text, { color: color }]}>FINISH</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 85,
    right: 25,
    height: 40,
    // width: 70,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontFamily: FontType.Medium,
    color: 'white',

  }

});

export default Timer;