import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontType } from "../helpers/theme";
import { eventButtonPush } from "../helpers/analytics";

interface Props {
  handleNextLesson: () => void;
  color: string;
}



const NextLesson: React.FC<Props> = ({ handleNextLesson, color }: Props) => {

  const pressHandler = () => {
    eventButtonPush('Next Lesson');
    handleNextLesson();
  }

  return (
    <TouchableOpacity style={styles.button} onPress={pressHandler}>
      <Text allowFontScaling={false} style={[styles.text, { color: color }]}>NEXT</Text>
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

export default NextLesson;