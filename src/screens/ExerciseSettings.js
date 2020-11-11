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
  soundStatus,
  timesUp,
  handleMusicButton,
  goToCalibration,
}) => {
  const breathing = useSelector((state) => state.breathing);
  const dispatch = useDispatch();
  const handleTimeSelect = (duration) => {
    breathing.type === 'guided'
      ? dispatch({type: 'SELECT_GUIDED_TIME', breathingTime: duration})
      : dispatch({type: 'SELECT_FIXED_TIME', breathingTime: duration});
  };
  const showTimePicker = playButtonTitle.toLowerCase() === 'start';
  const showCalibration = breathing.type === 'guided' && showTimePicker;

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
        <ButtonBig title={playButtonTitle} handlePress={handlePlayPause} />
        <TouchableOpacity
          style={styles.soundHolder}
          onPress={handleMusicButton}>
          <Image
            style={styles.sound}
            source={
              soundStatus
                ? require('../../assets/icons/music.png')
                : require('../../assets/icons/no_music.png')
            }
          />
        </TouchableOpacity>
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
    width: ScreenWidth * 0.85,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  bottomHolder: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 35,
    position: 'absolute',
  },
  soundHolder: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    // backgroundColor: 'yellow',
  },
  sound: {
    height: 25,
    width: 25,
    tintColor: 'white',
  },
});
