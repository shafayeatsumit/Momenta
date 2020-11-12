import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import ButtonBig from '../components/ButtonBig';
import ButtonSmall from '../components/ButtonSmall';
import {useSelector, useDispatch} from 'react-redux';
import {ScreenWidth} from '../helpers/constants/common';
import {FontType, Colors} from '../helpers/theme';

const ExerciseSettings = ({
  playButtonTitle,
  handlePlayPause,
  goToCalibration,
  showSettings,
}) => {
  const breathing = useSelector((state) => state.breathing);
  const dispatch = useDispatch();
  const handleTimeSelect = (duration) => {
    breathing.type === 'guided'
      ? dispatch({type: 'SELECT_GUIDED_TIME', breathingTime: duration})
      : dispatch({type: 'SELECT_FIXED_TIME', breathingTime: duration});
  };
  const showTimePicker = playButtonTitle.toLowerCase() === 'start';
  const showOptions = playButtonTitle.toLowerCase() !== 'finish';
  const showCalibration = breathing.type === 'guided' && showTimePicker;
  const bigButtonColor =
    playButtonTitle.toLowerCase() === 'start'
      ? Colors.buttonBlue
      : Colors.betterBlue;
  const bigButtonTitleColor =
    playButtonTitle.toLowerCase() === 'start' ? 'white' : Colors.buttonBlue;
  return (
    <View style={[styles.container, showCalibration && {height: 220}]}>
      {showCalibration && (
        <TouchableOpacity
          style={styles.calibrateTextHolder}
          onPress={goToCalibration}>
          <Text style={styles.calibrateText}>Calibrate this exercise</Text>
        </TouchableOpacity>
      )}
      {showTimePicker && (
        <View style={styles.smallButtonContainer}>
          <ButtonSmall title="1 min" handlePress={() => handleTimeSelect(1)} />
          <ButtonSmall title="3 min" handlePress={() => handleTimeSelect(3)} />
          <ButtonSmall title="5 min" handlePress={() => handleTimeSelect(5)} />
        </View>
      )}
      <View style={styles.bottomHolder}>
        {showOptions ? (
          <TouchableOpacity style={styles.optionsHolder} onPress={showSettings}>
            <Image
              style={styles.options}
              source={require('../../assets/icons/options.png')}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.optionsHolder} />
        )}
        <ButtonBig
          title={playButtonTitle}
          handlePress={handlePlayPause}
          containerStyle={[styles.bigButton, {backgroundColor: bigButtonColor}]}
          titleStyle={{color: bigButtonTitleColor}}
        />
      </View>
    </View>
  );
};
export default ExerciseSettings;

const styles = StyleSheet.create({
  container: {
    height: 180,
    width: ScreenWidth,
    alignItems: 'center',
    // justifyContent: 'space-around',
    // backgroundColor: 'yellow',
  },
  calibrateTextHolder: {
    height: 40,
    width: 180,
    alignSelf: 'center',
    // backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  calibrateText: {
    fontSize: 14,
    fontFamily: FontType.Regular,
    color: Colors.buttonBlue,
  },
  smallButtonContainer: {
    height: 50,
    width: ScreenWidth * 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  bigButton: {
    width: 220,
  },
  bottomHolder: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    bottom: 35,
    width: ScreenWidth * 0.8,
    position: 'absolute',
    // backgroundColor: 'red',
  },
  optionsHolder: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  options: {
    width: 25,
    resizeMode: 'contain',
    height: 25,
    tintColor: '#D8D8D8',
  },
});
