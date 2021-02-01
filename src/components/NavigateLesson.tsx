import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontType } from "../helpers/theme";
import { eventButtonPush } from "../helpers/analytics";

interface Props {
  handleNextLesson?: () => void;
  handlePrevLesson?:()=>void;
  color: string;
  title:string;
}

const NavigateLesson: React.FC<Props> = ({ handleNextLesson,handlePrevLesson, color, title }: Props) => {

  const pressHandler = () => {
    const eventType = handleNextLesson ? 'Next Lesson': 'Previous Lesson';
    eventButtonPush(eventType);
    handleNextLesson ?
    handleNextLesson() : handlePrevLesson();
  }
  const isBackButton = handlePrevLesson;
  return (
    <TouchableOpacity style={[styles.button, isBackButton ? {left:25}: {right:25}]} onPress={pressHandler}>
      <Text allowFontScaling={false} style={[styles.text, { color: color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 85,    
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

export default NavigateLesson;