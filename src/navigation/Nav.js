import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/home/Home';
import SettingsScreen from '../screens/settings/Settings';
import ContentScreen from '../screens/content/Content';
import CheckInScreen from '../screens/check_in/CheckIn';
import LoadingScreen from '../screens/Loading';
import ProfileScreen from '../screens/profile/Profile';
import OnboardingScreen from '../screens/onboarding/Onboarding';
import GuidedBreathingScreen from '../screens/guided_breathing/GuidedBreathing';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

class Nav extends Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar hidden />

        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="GuidedBreathing"
            component={GuidedBreathingScreen}
          />
          <Stack.Screen name="CheckIn" component={CheckInScreen} />

          <Stack.Screen name="Loading" component={LoadingScreen} />

          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />

          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Nav;
