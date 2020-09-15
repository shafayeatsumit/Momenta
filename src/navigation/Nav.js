import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/home/Home';
import OnboardingIntro from '../screens/onboarding/IntroFlow';
import CheckinTutorial from '../screens/onboarding/CheckinTutorial';
import FixedBreathingScreen from '../screens/fixed_breathing/FixedBreathing';

import LoadingScreen from '../screens/Loading';
import ProfileScreen from '../screens/profile/Profile';
import ContentScreen from '../screens/content/Content';
import GuidedBreathingScreen from '../screens/guided_breathing/GuidedBreathing';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

class Nav extends Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar hidden />
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="CheckinTutorial" component={CheckinTutorial} />

          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="OnboardingIntro" component={OnboardingIntro} />

          <Stack.Screen name="Content" component={ContentScreen} />
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
