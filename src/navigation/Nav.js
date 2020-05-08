import React from 'react';
import {StyleSheet, StatusBar, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RFValue} from '../helpers/responsiveFont';
import BookmarkScreen from '../screens/bookmarks/Bookmarks';
import HomeScreen from '../screens/home/Home';
import ProfileScreen from '../screens/profile/Profile';
import {colors} from '../helpers/theme';
import HomeIcon from '../../assets/icons/home.png';
import BookmarkIcon from '../../assets/icons/bookmark.png';
import UserIcon from '../../assets/icons/user.png';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import analytics from '@react-native-firebase/analytics';

Icon.loadFont();
const TabColors = {
  activeTint: 'rgb(216,216,216)',
  inactiveTint: '#696E95',
  inactiveBackgroundColor: '#31396C',
};

const Tab = createBottomTabNavigator();
const getActiveRouteName = (state) => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

const Nav = () => {
  const categories = useSelector((state) => state.categories);
  const minimized = useSelector((state) => state.minimized);
  const hideHomeScreen = categories.multiselectMode && !minimized;
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  return (
    <NavigationContainer
      onStateChange={(state) => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = getActiveRouteName(state);
        if (previousRouteName !== currentRouteName) {
          console.log(currentRouteName);
          analytics().setCurrentScreen(currentRouteName);
        }
        // Save the current route name for later comparision
        routeNameRef.current = currentRouteName;
      }}>
      <StatusBar hidden />
      <Tab.Navigator
        tabBarOptions={{
          style: styles.container,
          activeTintColor: TabColors.activeTint,
          inactiveTintColor: TabColors.inactiveTint,
          showLabel: false,
        }}>
        <Tab.Screen
          name="home"
          component={HomeScreen}
          options={{
            tabBarVisible: !hideHomeScreen,
            tabBarIcon: ({color}) => (
              <Image
                source={HomeIcon}
                style={[styles.icon, {tintColor: color}]}
              />
            ),
          }}
        />
        <Tab.Screen
          name="bookmarks"
          component={BookmarkScreen}
          options={{
            tabBarIcon: ({color}) => (
              <Image
                source={BookmarkIcon}
                style={[styles.icon, {tintColor: color}]}
              />
            ),
          }}
        />
        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({color}) => (
              <Image
                source={UserIcon}
                style={[styles.icon, {tintColor: color}]}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    borderTopColor: 'transparent',
    height: RFValue(100),
  },
  icon: {
    height: RFValue(30),
    width: RFValue(30),
  },
});

export default Nav;
