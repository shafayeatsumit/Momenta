import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/home/Home';
import LoadingScreen from '../screens/Loading';
import ChallengeScreen from "../screens/challenge/Challenge";
import ExerciseScreen from "../screens/exercise/Exercise";
import CalibrationScreen from "../screens/calibration/Calibration";
import CourseScreen from '../screens/course/Course';
import GuidedPracticeScreen from '../screens/guided_practice/GuidedPractice';

import { Colors } from '../helpers/theme';
const Stack = createStackNavigator();

class Nav extends Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar hidden />
        <Stack.Navigator
          headerMode="none"
          screenOptions={{
            gestureEnabled: false,
            cardStyle: { backgroundColor: "#121118" },
            cardStyleInterpolator: ({ current: { progress } }) => ({
              cardStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 0.5, 0.9, 1],
                  outputRange: [0, 0.25, 0.7, 1],
                }),
                transform: [
                  {
                    scale: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                  extrapolate: 'clamp',
                }),
              },
            }),
          }}>

          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Challenge" component={ChallengeScreen} />
          <Stack.Screen name="Exercise" component={ExerciseScreen} />
          <Stack.Screen name="Calibraiton" component={CalibrationScreen} />
          <Stack.Screen name="Course" component={CourseScreen} />
          <Stack.Screen name="GuidedPractice" component={GuidedPracticeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Nav;
