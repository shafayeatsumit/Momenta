import React from 'react';
import {StyleSheet, StatusBar, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {RFValue} from '../helpers/responsiveFont';
import HomeScreen from '../screens/home/Home';
import SettingsScreen from '../screens/settings/Settings';
import ContentScreen from '../screens/content/Content';

import {colors} from '../helpers/theme';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
const Nav = () => {
  return (
    <NavigationContainer>
      <StatusBar hidden />
      <Stack.Navigator headerMode="none">
        {/* <Stack.Screen name="Content" component={ContentScreen} /> */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Nav;
