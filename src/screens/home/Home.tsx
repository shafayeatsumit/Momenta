import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
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
    const { exerciseType } = exercise
    const navPath = exerciseType === 'guided' ? "GuidedExercise" : "FixedExercise"
    navigation.navigate(navPath, { exercise })
  }

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

