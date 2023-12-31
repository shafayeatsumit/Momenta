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
  const duration = Math.round(lesson.duration / 60);
  const min = duration > 1 ? 'mins' : 'min';
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.lessonCount}>
        <Text style={styles.text}>Lesson {lesson.order} of {totalLessons}</Text>
      </View>

      <Text style={styles.lessonTitle}>{lesson.title}</Text>
      <Text style={styles.text}>{duration} {min}</Text>
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
  lessonCount: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 2,
    borderRadius: 20,
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
    paddingHorizontal: 20,

  }
});
