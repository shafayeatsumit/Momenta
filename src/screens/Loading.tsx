import React, { useEffect } from 'react';
import { Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { FontType } from '../helpers/theme';
import { signUpAnonymously } from "../redux/actions/user";
import { fetchExercise } from "../redux/actions/exercise";
import { fetchGuidedPractice } from "../redux/actions/guidedPractice";
import { fetchCourse } from "../redux/actions/course";
import { fetchChallenge } from "../redux/actions/challenge";
import { RootState } from "../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { eventSetUserId } from "../helpers/analytics";

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

  useEffect(() => {
    if (exerciseFetchCompleted) navigation.replace('Home')
  }, [exerciseFetchCompleted])

  useEffect(() => {
    if (isExistingUser) eventSetUserId(user.id)
    if (!isExistingUser) dispatch(signUpAnonymously());
    dispatch(fetchExercise());
    dispatch(fetchCourse());
    dispatch(fetchGuidedPractice());
    dispatch(fetchChallenge());
  }, [])

  return (
    <LinearGradient
      useAngle={true}
      angle={192}
      angleCenter={{ x: 0.5, y: 0.5 }}
      start={{ x: 0, y: 0 }} end={{ x: 0.05, y: 0.95 }}
      colors={["#323545", "#121118"]}
      style={styles.loadingContainer}
    >
      <Image source={require('../../assets/images/momenta.png')} />
      <ActivityIndicator style={styles.loader} size="large" color="#808080" />
      <Text allowFontScaling={false} style={styles.text}>Breathe better.</Text>
    </LinearGradient>

  );
}

export default Loading;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  text: {
    fontFamily: FontType.Regular,
    paddingTop: 10,
    fontSize: 18,
    lineHeight: 22,
    color: 'white',
  }
});
