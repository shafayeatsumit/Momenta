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
  const isExistingUser = user.hasOwnProperty('id')
  const selectFetchCompleted = (state: RootState) => state.fetchCompleted;
  const fetchCompleted = useSelector(selectFetchCompleted);
  const { exerciseFetchCompleted, musicFetchCompleted } = fetchCompleted;
  const allFetchCompleted = exerciseFetchCompleted && musicFetchCompleted;

  useEffect(() => {
    if (allFetchCompleted) navigation.navigate('Home')
  }, [allFetchCompleted])

  useEffect(() => {
    if (!isExistingUser) dispatch(signUpAnonymously());
    if (!allFetchCompleted) {
      dispatch(fetchExercise());
      dispatch(fetchBackgroundMusic())
    }
  }, [])
  console.log('fetch completed', fetchCompleted)
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
