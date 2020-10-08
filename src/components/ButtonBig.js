import React from 'react';
import {TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {FontType, Colors} from '../helpers/theme';

const ButtonBig = ({handlePress, title, buttonColor, hasIcon, isOpen}) => (
  <TouchableOpacity
    style={[styles.container, buttonColor && {backgroundColor: buttonColor}]}
    onPress={handlePress}>
    <Text style={styles.text}>{title}</Text>
    {hasIcon && !isOpen && (
      <Image
        style={styles.arrow}
        source={require('../../assets/icons/arrow_down.png')}
      />
    )}
  </TouchableOpacity>
);
export default ButtonBig;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 290,
    borderRadius: 25,
    backgroundColor: Colors.betterBlueLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    flexDirection: 'row',
  },
  text: {
    fontFamily: FontType.Medium,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  arrow: {
    height: 20,
    width: 20,
    position: 'absolute',
    right: 20,
    top: 15,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
});
