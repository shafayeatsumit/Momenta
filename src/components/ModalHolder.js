import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../helpers/theme';

const ModalHolder = (props) => (
  <View style={styles.container}>{props.childern}</View>
);
export default ModalHolder;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.betterBlue,
  },
});
