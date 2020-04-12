import React, {Component} from 'react';
import Swiper from 'react-native-swiper';

import {StyleSheet, View, Platform, Text, PanResponder} from 'react-native';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
export default class Project extends Component {
  render() {
    return (
      <>
        <View style={{height: ScreenHeight * 0.2, backgroundColor: 'red'}} />
        <Swiper
          style={{height: ScreenHeight * 0.8, backgroundColor: 'yellow'}}
          showsButtons={true}>
          <View style={styles.slide1}>
            <Text style={styles.text}>Hello Swiper</Text>
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>Beautiful</Text>
          </View>
        </Swiper>
      </>
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
