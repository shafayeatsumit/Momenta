import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors, FontType} from '../helpers/theme';

const ButtonSmall = ({title, containerStyle, titleStyle, handlePress}) => (
  <TouchableOpacity
    style={StyleSheet.flatten([styles.buttonSmall, containerStyle])}
    onPress={handlePress}>
    <Text style={StyleSheet.flatten([styles.title, titleStyle])}>{title}</Text>
  </TouchableOpacity>
);
export default ButtonSmall;

const styles = StyleSheet.create({
  buttonSmall: {
    height: 48,
    width: 100,
    borderRadius: 5,
    backgroundColor: Colors.buttonBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});