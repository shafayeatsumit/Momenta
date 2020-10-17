import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/home/Home';
import OnboardingIntro from '../screens/onboarding/IntroFlow';
import CheckinTutorial from '../screens/onboarding/CheckinTutorial';
import FixedBreathingScreen from '../screens/fixed_breathing/FixedBreathing';

import BreathingTypeScreen from '../screens/breathing_type/BreathingType';
import LoadingScreen from '../screens/Loading';
import ProfileScreen from '../screens/profile/Profile';
import ContentScreen from '../screens/content/Content';
import GuidedBreathingScreen from '../screens/guided_breathing/GuidedBreathing';
import {createStackNavigator} from '@react-navigation/stack';
import {Colors} from '../helpers/theme';
const Stack = createStackNavigator();

class Nav extends Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar hidden />
        <Stack.Navigator
          headerMode="none"
          screenOptions={{
            cardStyle: {backgroundColor: Colors.betterBlue},
            cardStyleInterpolator: ({current: {progress}}) => ({
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
          {/* <Stack.Screen name="Content" component={ContentScreen} /> */}
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BreathingType" component={BreathingTypeScreen} />
          <Stack.Screen name="CheckinTutorial" component={CheckinTutorial} />
          <Stack.Screen name="OnboardingIntro" component={OnboardingIntro} />
          <Stack.Screen
            name="GuidedBreathing"
            component={GuidedBreathingScreen}
          />
          <Stack.Screen
            name="FixedBreathing"
            component={FixedBreathingScreen}
          />

          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Nav;
