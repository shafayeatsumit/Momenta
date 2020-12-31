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
    <ScrollView contentContainerStyle={styles.tilesContainer}>
      {allExercise.map((exercise) => {
        return (
          <Thumbnail goToExercise={goToExercise} key={exercise.id} exercise={exercise} />
        )
      })}
    </ScrollView>
  );
};

export default Home;
