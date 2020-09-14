import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {FontType, Colors} from '../../helpers/theme';

const ButtonBig = ({handlePress, title, buttonColor}) => (
  <TouchableOpacity
    style={[styles.container, buttonColor && {backgroundColor: buttonColor}]}
    onPress={handlePress}>
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);
export default ButtonBig;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 270,
    borderRadius: 25,
    backgroundColor: Colors.betterBlueLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  text: {
    fontFamily: FontType.Medium,
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
});
