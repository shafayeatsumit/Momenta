import React from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native';
import { eventButtonPush } from "../helpers/analytics";
import { FontType } from '../helpers/theme';
import { Lesson } from "../helpers/types";


interface Props {
  lesson: Lesson;
  opacity?: any;
  totalLessons: number;
}

const CourseTitle: React.FC<Props> = ({ lesson, opacity, totalLessons }: Props) => {
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.text}>Lesson {lesson.order} of {totalLessons}</Text>
      <Text style={styles.lessonTitle}>{lesson.title}</Text>
      <Text style={styles.text}>1 min</Text>
    </Animated.View >
  );
}

export default CourseTitle;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 95,
    height: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  lessonTitle: {
    textAlign: 'center',
    fontFamily: FontType.Medium,
    fontSize: 20,
    color: 'white',
    paddingHorizontal: 80,
  },
  text: {
    textAlign: 'center',
    fontFamily: FontType.Regular,
    fontSize: 18,
    color: 'white',
    paddingHorizontal: 80,
  }
});
