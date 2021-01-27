import React, { useEffect } from 'react';
import { View, BackHandler, ScrollView, Platform } from 'react-native';
import { eventButtonPush } from "../../helpers/analytics";
import Thumbnail from "./Thumbnail";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootState } from "../../redux/reducers";
import { useSelector } from "react-redux";
import styles from './Home.styles';
import _ from "lodash";
import { Exercise } from "../../redux/actions/exercise";
import LinearGradient from 'react-native-linear-gradient';

export interface Props {
  navigation: StackNavigationProp<any, any>;
};

const Home: React.FC<Props> = ({ navigation }: Props) => {
  const selectExercise = (state: RootState) => state.exercise;
  const allExercise = _.values(useSelector(selectExercise));

  const goToExercise = (exercise: Exercise) => {
    eventButtonPush(`go_to_${exercise.displayName}`);
    const { exerciseType } = exercise
    const navPath = exerciseType === 'guided' ? "GuidedExercise" : "FixedExercise"
    navigation.navigate(navPath, { exercise })
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

      <ScrollView contentContainerStyle={styles.tilesContainer}>
        {allExercise.map((exercise) => {
          return (
            <Thumbnail goToExercise={goToExercise} key={exercise.id} exercise={exercise} />
          )
        })}
      </ScrollView>
    </LinearGradient>
  );
};

export default Home;

