import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../helpers/theme';
import { signUpAnonymously } from "../redux/actions/user";
import { fetchBackgroundMusic } from "../redux/actions/backgroundMusic";
import { fetchExercise } from "../redux/actions/exercise";
import { RootState } from "../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { StackNavigationProp } from '@react-navigation/stack';


export interface Props {
  navigation: StackNavigationProp<any, any>;
};

const Loading: React.FC<Props> = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const selectUser = (state: RootState) => state.user;
  const user = useSelector(selectUser)
  const selectBackgroundMusic = (state: RootState) => state.backgroundMusic;
  const backgroundMusic = useSelector(selectBackgroundMusic);
  const selectExercise = (state: RootState) => state.exercise;
  const exercise = useSelector(selectExercise);
  const isExistingUser = user.hasOwnProperty('_id')

  useEffect(() => {
    const isFetchCompleted = backgroundMusic.fetchCompleted || exercise.fetchCompleted;
    if (isFetchCompleted) navigation.navigate('Home', { name: 'sumit' })
  }, [backgroundMusic.fetchCompleted, exercise.fetchCompleted])

  useEffect(() => {
    if (!isExistingUser) dispatch(signUpAnonymously());
    if (!exercise.fetchCompleted) dispatch(fetchExercise());
    if (!backgroundMusic.fetchCompleted) dispatch(fetchBackgroundMusic());
  }, [])

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  );
}
export default Loading;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },

});
