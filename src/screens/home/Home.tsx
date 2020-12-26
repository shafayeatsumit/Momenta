import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootState } from "../../redux/reducers";
import { useSelector } from "react-redux";
import _ from "lodash";

export interface Props {
  navigation: StackNavigationProp<any, any>;
};

const Home: React.FC<Props> = ({ navigation }: Props) => {
  const selectExercise = (state: RootState) => state.exercise;
  let exercise = useSelector(selectExercise);
  console.log('exercise', _.values(exercise))
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, color: 'white' }}>HOme</Text>
    </View>
  );
};

export default Home;
