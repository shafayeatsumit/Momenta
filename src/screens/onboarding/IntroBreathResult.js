import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ComonStyles from './Onboarding.styles';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';

class IntroBreathResult extends Component {
  render() {
    const {inhaleTime, exhaleTime, redoBreathing} = this.props;
    const total = Number(inhaleTime) + Number(exhaleTime);
    const rythm = (60 / total).toFixed(0);
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.buttonText}>Inhale</Text>
            <Text style={styles.buttonText}>{inhaleTime}s</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.buttonText}>Exhale</Text>
            <Text style={styles.buttonText}>{exhaleTime} s</Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.buttonText}>Total</Text>
            <Text style={styles.buttonText}>{total}s</Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.buttonText}>Rhythm</Text>
            <Text style={styles.buttonText}>
              {rythm} <Text style={{fontSize: 15}}>breaths/min</Text>
            </Text>
          </View>
        </View>
        <View style={{flex: 1}} />

        <View style={ComonStyles.smallButtonContainer}>
          <TouchableOpacity
            style={ComonStyles.redoButtonSm}
            onPress={redoBreathing}>
            <Text style={styles.buttonText}>Redo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ComonStyles.nextButtonSm}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default IntroBreathResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultContainer: {
    flex: 3,
    marginTop: 100,
  },
  buttonText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
  },
  timeContainer: {
    height: 100,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  buttonContainer: {},
});
