import React, { useEffect } from 'react';
import { View, SafeAreaView, Text, BackHandler, ScrollView, Platform } from 'react-native';
import { eventButtonPush } from "../../helpers/analytics";
import Thumbnail from "./Thumbnail";
import { ScreenHeight, ScreenWidth } from '../../helpers/constants';
import ChallengeThumbnail from "./ChallengeThumbnail";
import GuidedPracticeThumbnail from './GuidedPracticeThumbnail';
import CourseThumbnail from './CourseThumbnail';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootState } from "../../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import styles from './Home.styles';
import _ from "lodash";
import { Exercise } from "../../redux/actions/exercise";
import LinearGradient from 'react-native-linear-gradient';
import { Course } from '../../redux/actions/course';
import { GuidePractice } from '../../redux/actions/guidedPractice';
import TrackPlayer from 'react-native-track-player';
import { Challenge } from '../../redux/actions/challenge';
import Title from './Title';

export interface Props {
  navigation: StackNavigationProp<any, any>;
};

const Home: React.FC<Props> = ({ navigation }: Props) => {
  const selectExercise = (state: RootState) => state.exercise;
  const allExercise = _.values(useSelector(selectExercise));
  const selectChallenge = (state: RootState) => state.challenge;
  const allChallenge = _.values(useSelector(selectChallenge));
  const selectCourse = (state: RootState) => state.course;
  const allCourse = _.values(useSelector(selectCourse));
  const selectGuidedPractice = (state: RootState) => state.guidedPracitce;
  const allGuidedPractice = _.values(useSelector(selectGuidedPractice));

  const goToExercise = (exercise: Exercise) => {
    eventButtonPush(`go_to_${exercise.name}`);
    navigation.navigate('Exercise', { exercise })
  }

  const goToCourse = (course: Course) => {
    eventButtonPush(`go_to_${course.name}`);
    navigation.navigate('Course', { course })
  }

  const goToChallenge = (challenge: Challenge) => {
    eventButtonPush(`go_to_${challenge.name}`);
    navigation.navigate('Challenge', { challenge })
  }

  const goToGuidedPractice = (guidePractice: GuidePractice) => {
    eventButtonPush(`go_to_${guidePractice.name}`);
    navigation.navigate('GuidedPractice', { guidePractice })
  }



  const backAction = () => {
    eventButtonPush('android_back_button')
    return false;
  };

  useEffect(() => {
    // Android only    
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
      TrackPlayer.destroy();
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
      <SafeAreaView>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Title title="Challenges" />
          {allChallenge.map((challenge) =>
            <Thumbnail
              containerStyle={{
                width: ScreenWidth / 1.15,
                height: ScreenHeight / 3.8,
              }}
              title="Challenges"
              handlePress={goToChallenge}
              key={challenge.id}
              item={challenge}
            />
          )}

          <Title title="Guided Practices" containerStyle={{ marginTop: 10 }} />
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={styles.tilesContainer}>
            {allGuidedPractice.map((practice) =>
              <Thumbnail
                containerStyle={{
                  width: ScreenWidth / 1.4,
                  height: ScreenHeight / 3.9,
                }}

                handlePress={goToGuidedPractice}
                key={practice.id}
                item={practice}
              />
            )}
          </ScrollView>

          <Title title="Exercises" containerStyle={{ marginTop: 10 }} />

          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={styles.tilesContainer}>
            {allExercise.map((exercise) =>
              <Thumbnail
                containerStyle={{
                  width: ScreenWidth / 2.3,
                  height: ScreenHeight / 3.8,
                }}

                handlePress={goToExercise}
                key={exercise.id}
                item={exercise}
              />
            )}
          </ScrollView>

          <Title title="Courses" containerStyle={{ marginTop: 10 }} />
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={styles.tilesContainer}>
            {allCourse.map((course) =>
              <Thumbnail
                containerStyle={{
                  width: ScreenWidth / 2.0,
                  height: ScreenHeight / 4.0,
                }}

                handlePress={goToCourse}
                key={course.id}
                item={course}
              />
            )}
          </ScrollView>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;

