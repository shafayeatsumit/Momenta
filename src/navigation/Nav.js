import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/Home';
import ExploreScreen from '../screens/explore/Explore';
import ProfileScreen from '../screens/profile/Profile';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont();
const TabColors = {
  activeTint: '#FFFFFF',
  inactiveTint: '#696E95',
  inactiveBackgroundColor: '#31396C',
};

const Tab = createBottomTabNavigator();

const Nav = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          style: style.container,
          activeTintColor: TabColors.activeTint,
          inactiveTintColor: TabColors.inactiveTint,
          showLabel: false,
        }}>
        <Tab.Screen
          name="home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="ios-home" size={30} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="explore"
          component={ExploreScreen}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="ios-search" size={30} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({color}) => (
              <Icon name="md-person" size={30} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: '#31396C',
    borderTopColor: 'transparent',
  },
});

export default Nav;
