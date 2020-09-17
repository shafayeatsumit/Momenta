import React, {useState} from 'react';
import {TouchableOpacity, Image, View, Text, StyleSheet} from 'react-native';
import {FontType, Colors} from '../../helpers/theme';
import {useSelector} from 'react-redux';
import arrow_down from '../../../assets/icons/arrow_down.png';

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
        {customConfigType !== 'inhale' && (
          <Image source={arrow_down} style={styles.arrow} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          customConfigType === 'inhaleHold' && {borderWidth: 2},
        ]}
        onPress={() => handleButtonPress('custom_inhale_hold', 'inhaleHold')}>
        <Text style={styles.text}>{inhaleHold}</Text>
        <Text style={styles.textSm}>Hold</Text>
        {customConfigType !== 'inhaleHold' && (
          <Image source={arrow_down} style={styles.arrow} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          customConfigType === 'exhale' && {borderWidth: 2},
        ]}
        onPress={() => handleButtonPress('custom_exhale', 'exhale')}>
        <Text style={styles.text}>{exhale}</Text>
        <Text style={styles.textSm}>Exhale</Text>
        {customConfigType !== 'exhale' && (
          <Image source={arrow_down} style={styles.arrow} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          customConfigType === 'exhaleHold' && {borderWidth: 2},
        ]}
        onPress={() => handleButtonPress('custom_exhale_hold', 'exhaleHold')}>
        <Text style={styles.text}>{exhaleHold}</Text>
        <Text style={styles.textSm}>Hold</Text>
        {customConfigType !== 'exhaleHold' && (
          <Image source={arrow_down} style={styles.arrow} />
        )}
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
  arrow: {
    position: 'absolute',
    tintColor: 'white',
    height: 17,
    width: 17,
    right: 8,
    top: 18,
  },

  button: {
    height: 70,
    width: 70,
    borderRadius: 25,
    marginHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    backgroundColor: Colors.betterBlueLight,
    borderColor: Colors.cornflowerBlue,
    borderWidth: 0,
  },
  text: {
    fontFamily: FontType.Medium,
    textAlign: 'left',
    color: 'white',
    fontSize: 16,
    paddingRight: 10,
  },
  textSm: {
    fontFamily: FontType.Regular,
    textAlign: 'left',
    color: 'white',
    fontSize: 12,
    paddingRight: 10,
  },
});
