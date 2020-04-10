import React, {Component} from 'react';

import {StyleSheet, View, Platform, Text, PanResponder} from 'react-native';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
export default class Project extends Component {
  render() {
    return (
      <View style={styles.MainContainer}>
        <Text>Home</Text>
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
});
