import React from 'react'
import { Animated, Text, View, StyleSheet } from 'react-native';
import { eventButtonPush } from "../helpers/analytics";
import { FontType } from '../helpers/theme';

interface Props {
  title: string;
  opacity?: any;
}

const CourseTitle: React.FC<Props> = ({ title, opacity }: Props) => {
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.courseTitle}>
        {title}
      </Text>
    </Animated.View >
  );
}

export default CourseTitle;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 35,
    height: 80,
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    paddingTop: 5,
  },
  courseTitle: {
    textAlign: 'center',
    fontFamily: FontType.Bold,
    fontSize: 24,
    color: 'white',
    paddingHorizontal: 80,
  },
});
