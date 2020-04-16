import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/Home';
import ExploreScreen from '../screens/explore/Explore';
import ProfileScreen from '../screens/profile/Profile';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
Icon.loadFont();
const TabColors = {
  activeTint: '#FFFFFF',
  inactiveTint: '#696E95',
  inactiveBackgroundColor: '#31396C',
};

const Tab = createBottomTabNavigator();
const Nav = () => {
  const categories = useSelector((state) => state.categories);
  const contents = useSelector((state) => state.contents);
  const hideHomeScreen = categories.multiselectMode && !contents.minimized;
  return (
    <NavigationContainer>
      <StatusBar hidden />
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
            tabBarVisible: !hideHomeScreen,
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
    // height: 0,
  },
});

export default Nav;
