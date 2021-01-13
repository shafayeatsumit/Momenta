import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, FontType } from '../helpers/theme';

interface Props {
  title: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  handlePress: () => void;
}

const Button = ({ title, containerStyle, titleStyle, handlePress }: Props) => (
  <TouchableOpacity
    style={StyleSheet.flatten([styles.buttonSmall, containerStyle])}
    onPress={handlePress}>
    <Text
      allowFontScaling={false}
      style={StyleSheet.flatten([styles.title, titleStyle])}>
      {title}
    </Text>
  </TouchableOpacity>
);
export default Button;

const styles = StyleSheet.create({
  buttonSmall: {
    height: 48,
    width: 114,
    borderRadius: 5,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});
