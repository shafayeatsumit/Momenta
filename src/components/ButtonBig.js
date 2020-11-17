import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors, FontType} from '../helpers/theme';

const BigButton = ({title, containerStyle, titleStyle, handlePress}) => (
  <TouchableOpacity
    style={StyleSheet.flatten([styles.bigButton, containerStyle])}
    onPress={handlePress}>
    <Text
      allowFontScaling={false}
      style={StyleSheet.flatten([styles.title, titleStyle])}>
      {title}
    </Text>
  </TouchableOpacity>
);
export default BigButton;

const styles = StyleSheet.create({
  bigButton: {
    height: 48,
    width: 263,
    borderRadius: 8,
    backgroundColor: Colors.buttonBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
  },
});
