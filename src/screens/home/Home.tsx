import React, { useEffect } from 'react';
import { View, Text, BackHandler, ScrollView, Platform } from 'react-native';
import { eventButtonPush } from "../../helpers/analytics";
import Thumbnail from "./Thumbnail";
import CoursheThumbnail from './CourseThumbnail';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from "../../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import styles from './Home.styles';
import _ from "lodash";
import { Exercise } from "../../redux/actions/exercise";
import LinearGradient from 'react-native-linear-gradient';
import { Course } from '../../redux/actions/course';

export interface Props {
  navigation: StackNavigationProp<any, any>;
};

const Home: React.FC<Props> = ({ navigation }: Props) => {
  const selectUser = (state: RootState) => state.user;
  const user = useSelector(selectUser);
  const selectExercise = (state: RootState) => state.exercise;
  const allExercise = _.values(useSelector(selectExercise));
  const selectCourse = (state: RootState) => state.course;
  const allCourse = _.values(useSelector(selectCourse));

  const goToExercise = (exercise: Exercise) => {
    eventButtonPush(`go_to_${exercise.displayName}`);
    const { exerciseType } = exercise
    const navPath = exerciseType === 'guided' ? "GuidedExercise" : "FixedExercise"
    navigation.navigate(navPath, { exercise })
  }

  const goToCourse = (course: Course) => {
    eventButtonPush(`go_to_${course.name}`);
    navigation.navigate('Course', { course })
  }

  const backAction = () => {
    eventButtonPush('android_back_button')
    return false;
  };

  useEffect(() => {
    // for Android only    
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
    }
  }, [])

  return (
    <LinearGradient
      useAngle={true}
      angle={192}
      angleCenter={{ x: 0.5, y: 0.5 }}
      start={{ x: 0, y: 0 }} end={{ x: 0.05, y: 0.95 }}
      colors={["#323545", "#121118"]}
      style={styles.mainContainer}
    >
      <View style={styles.titleHolder}>
        <Text style={styles.title}>Exercises</Text>
      </View>
      <View >
        <ScrollView horizontal={true} contentContainerStyle={styles.tilesContainer}>
          {allExercise.map((exercise) =>
            <Thumbnail goToExercise={goToExercise} key={exercise.id} exercise={exercise} />
          )}
        </ScrollView>
      </View>
      <View style={styles.titleHolder}>
        <Text style={styles.title}>Courses</Text>
      </View>
      <View >
        <ScrollView horizontal={true} contentContainerStyle={styles.tilesContainer}>
          {allCourse.map((course) =>
            <CoursheThumbnail goToCourse={goToCourse} key={course.id} course={course} />
          )}
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default Home;

