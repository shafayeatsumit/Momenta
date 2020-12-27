import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Thumbnail from "./Thumbnail";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootState } from "../../redux/reducers";
import { useSelector } from "react-redux";
import styles from './Home.styles';
import _ from "lodash";

export interface Props {
  navigation: StackNavigationProp<any, any>;
};

const Home: React.FC<Props> = ({ navigation }: Props) => {
  const selectExercise = (state: RootState) => state.exercise;
  const allExercise = _.values(useSelector(selectExercise));

  return (
    <ScrollView contentContainerStyle={styles.tilesContainer}>
      {allExercise.map((exercise) => {
        return (
          <Thumbnail key={exercise._id} exercise={exercise} />
        )
      })}
    </ScrollView>
  );
};

export default Home;
