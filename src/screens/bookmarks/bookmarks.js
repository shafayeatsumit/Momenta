import React, {Component} from 'react';
import Swiper from 'react-native-swiper';

import {StyleSheet, View, Platform, Text, PanResponder} from 'react-native';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

export default class Project extends Component {
  render() {
    return (
      <View style={styles.MainContainer}>
        <AnimatedCircularProgress
          size={60}
          width={3}
          fill={30}
          rotation={360}
          duration={1000}
          tintColor="red"
          onAnimationComplete={() => console.log('onAnimationComplete')}
          backgroundColor="rgba(255, 255, 255, 0.2)"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
