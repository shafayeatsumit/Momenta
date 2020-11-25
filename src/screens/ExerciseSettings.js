import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import ButtonBig from '../components/ButtonBig';
import ButtonSmall from '../components/ButtonSmall';
import {useSelector, useDispatch} from 'react-redux';
import {ScreenWidth} from '../helpers/constants/common';
import {FontType, Colors} from '../helpers/theme';
import analytics from '@react-native-firebase/analytics';

const ExerciseSettings = ({
  playButtonTitle,
  handlePlayPause,
  goToCalibration,
  showSettings,
  hideButtons,
}) => {
  const breathing = useSelector((state) => state.breathing);
  const dispatch = useDispatch();
  const handleTimeSelect = (duration) => {
    breathing.type === 'guided'
      ? dispatch({type: 'SELECT_GUIDED_TIME', breathingTime: duration})
      : dispatch({type: 'SELECT_FIXED_TIME', breathingTime: duration});
  };
  const buttonTitle = playButtonTitle.toLowerCase();
  const isChallenge = breathing.challenge;
  const showTimePicker = buttonTitle === 'start' && !isChallenge;

  const showOptions =
    playButtonTitle.toLowerCase() !== 'finish' &&
    playButtonTitle.toLowerCase() !== 'pause';
  const showCalibration =
    (isChallenge && buttonTitle === 'start') ||
    (breathing.type === 'guided' && showTimePicker);

  const bigButtonTitleColor =
    buttonTitle === 'pause' || buttonTitle === 'finish'
      ? Colors.buttonBlue
      : 'white';

  const selectTime = (duration) => {
    handleTimeSelect(duration);
    analytics().logEvent('button_push', {title: `duration_${duration}`});
  };
  if (hideButtons) {
    return <View />;
  }
  const selectedTime = breathing.breathingTime;
  return (
    <View
      style={[
        styles.container,
        showCalibration && {height: 230},
        breathing.challenge && {height: 150},
      ]}>
      {showCalibration && (
        <TouchableOpacity
          style={styles.calibrateTextHolder}
          onPress={goToCalibration}>
          <Text allowFontScaling={false} style={styles.calibrateText}>
            Calibrate this exercise
          </Text>
        </TouchableOpacity>
      )}
      {showTimePicker && (
        <View style={styles.smallButtonContainer}>
          <ButtonSmall
            titleStyle={[selectedTime !== 1 && {color: Colors.buttonBlue}]}
            containerStyle={[
              selectedTime !== 1 && {backgroundColor: Colors.betterBlue},
            ]}
            title="1 min"
            handlePress={() => selectTime(1)}
          />
          <ButtonSmall
            titleStyle={[selectedTime !== 2 && {color: Colors.buttonBlue}]}
            containerStyle={[
              selectedTime !== 2 && {backgroundColor: Colors.betterBlue},
            ]}
            title="2 min"
            handlePress={() => selectTime(2)}
          />
          <ButtonSmall
            titleStyle={[selectedTime !== 5 && {color: Colors.buttonBlue}]}
            containerStyle={[
              selectedTime !== 5 && {backgroundColor: Colors.betterBlue},
            ]}
            title="5 min"
            handlePress={() => selectTime(5)}
          />
        </View>
      )}
      <View
        style={[
          styles.bottomHolder,
          buttonTitle === 'finish' && {justifyContent: 'center'},
          buttonTitle === 'pause' && {justifyContent: 'center'},
        ]}>
        {showOptions && (
          <TouchableOpacity style={styles.optionsHolder} onPress={showSettings}>
            <Image
              style={styles.options}
              source={require('../../assets/icons/options.png')}
            />
          </TouchableOpacity>
        )}
        <ButtonBig
          title={playButtonTitle}
          handlePress={handlePlayPause}
          containerStyle={[
            styles.bigButton,
            buttonTitle === 'pause' && {backgroundColor: Colors.betterBlue},
            buttonTitle === 'finish' && {backgroundColor: Colors.betterBlue},
          ]}
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
  },
  calibrateTextHolder: {
    height: 50,
    width: 280,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    // backgroundColor: 'yellow',
  },
  calibrateText: {
    fontSize: 18,
    fontFamily: FontType.Medium,
    color: Colors.buttonBlue,
  },
  smallButtonContainer: {
    height: 50,
    width: ScreenWidth * 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  bigButton: {
    width: 220,
  },
  bottomHolder: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 35,
    width: ScreenWidth * 0.8,
    position: 'absolute',
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
  },
});
