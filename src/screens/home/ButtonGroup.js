import React, {useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {FontType, Colors} from '../../helpers/theme';
import {useSelector} from 'react-redux';

const ButtonGroup = ({handlePress, customConfigType}) => {
  const {inhale, inhaleHold, exhale, exhaleHold} = useSelector(
    (state) => state.fixedBreathing,
  );
  const handleButtonPress = (breathingId, breathingType) => {
    handlePress(breathingId, breathingType);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          customConfigType === 'inhale' && {borderWidth: 2},
        ]}
        onPress={() => handleButtonPress('custom_inhale', 'inhale')}>
        <Text style={styles.text}>{inhale}</Text>
        <Text style={styles.textSm}>Inhale</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          customConfigType === 'inhaleHold' && {borderWidth: 2},
        ]}
        onPress={() => handleButtonPress('custom_inhale_hold', 'inhaleHold')}>
        <Text style={styles.text}>{inhaleHold}</Text>
        <Text style={styles.textSm}>Hold</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          customConfigType === 'exhale' && {borderWidth: 2},
        ]}
        onPress={() => handleButtonPress('custom_exhale', 'exhale')}>
        <Text style={styles.text}>{exhale}</Text>
        <Text style={styles.textSm}>Exhale</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          customConfigType === 'exhaleHold' && {borderWidth: 2},
        ]}
        onPress={() => handleButtonPress('custom_exhale_hold', 'exhaleHold')}>
        <Text style={styles.text}>{exhaleHold}</Text>
        <Text style={styles.textSm}>Hold</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ButtonGroup;

const styles = StyleSheet.create({
  container: {
    height: 95,
    width: 290,
    flexDirection: 'row',
  },
  button: {
    height: 70,
    width: 70,
    borderRadius: 25,
    marginHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlueLight,
    borderColor: Colors.cornflowerBlue,
    borderWidth: 0,
  },
  text: {
    fontFamily: FontType.Medium,
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  textSm: {
    fontFamily: FontType.Regular,
    textAlign: 'center',
    color: 'white',
    fontSize: 13,
  },
});
