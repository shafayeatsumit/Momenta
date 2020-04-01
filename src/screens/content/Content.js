import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet, ImageBackground, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, FontType} from '../../helpers/theme';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native-gesture-handler';

const THOUGHT = 'Notice how you \nfeel compared to \nbefore.';
const BG =
  'https://images.unsplash.com/photo-1581090824720-3c9f822192dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';
const Content = (props) => {
  const [categoryOpacity] = useState(new Animated.Value(0));
  const [contentOpacity] = useState(new Animated.Value(0));

  const fadeInAnim = () => {
    Animated.sequence([
      Animated.timing(categoryOpacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    fadeInAnim();
  }, []);

  return (
    <ImageBackground style={styles.container} source={{uri: BG}}>
      <LinearGradient
        colors={['rgba(27,31,55,0.57)', 'rgba(27,31,56,1)', 'rgba(27,31,56,1)']}
        style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Animated.Text style={[styles.category, {opacity: categoryOpacity}]}>
            Calm
          </Animated.Text>
        </View>
        <View style={styles.middleRow}>
          <Animated.Text style={[styles.content, {opacity: contentOpacity}]}>
            {THOUGHT}
          </Animated.Text>
          <View
            onStartShouldSetResponder={() =>
              console.log('You have cliked left')
            }
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: ScreenWidth / 2,
              top: -20,
              left: 0,
              backgroundColor: 'transparent',
              zIndex: 3,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: ScreenWidth / 2,
              top: -20,
              zIndex: 3,
              // left: 0,
              backgroundColor: 'transparent',
            }}
            onStartShouldSetResponder={() =>
              console.log('You have cliked right')
            }
          />
        </View>
        <View
          style={{height: '15%', backgroundColor: 'yellow', width: ScreenWidth}}
        />
      </LinearGradient>
    </ImageBackground>
  );
};
export default Content;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    height: ScreenHeight / 2,
  },
  contentContainer: {
    flex: 1,
  },
  topRow: {
    height: ScreenHeight / 2.2,
    marginLeft: 30,
    justifyContent: 'flex-end',
  },
  middleRow: {
    flex: 1,
    marginLeft: 30,
  },
  category: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    paddingBottom: 40,
  },
  content: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 25,
    textAlign: 'left',
    paddingRight: 20,
    lineHeight: 40,
    zIndex: 1,
  },
});
