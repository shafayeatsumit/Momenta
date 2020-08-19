import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import moment from 'moment';
import {FontType, Colors} from '../../helpers/theme';
import LottieView from 'lottie-react-native';

const DAYS_OF_THE_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const LETTERS = {
  S: require('../../../assets/anims/S.json'),
  M: require('../../../assets/anims/M.json'),
  W: require('../../../assets/anims/W.json'),
  T: require('../../../assets/anims/T.json'),
  F: require('../../../assets/anims/F.json'),
};

const getDay = () => {
  return moment().format('dddd');
};

class MeasurementSuccess extends Component {
  goNext = () => {
    this.timerId = setTimeout(() => {
      this.props.goNext();
      clearTimeout(this.timerId);
    }, 1000);
  };

  getDays = (item) => {
    const firstLetter = item.charAt(0);
    const letterSource = LETTERS[firstLetter];
    if (item === getDay()) {
      return (
        <View style={styles.animContainer} key={item}>
          <LottieView
            style={styles.anim}
            autoSize
            source={letterSource}
            autoPlay
            loop={false}
            onAnimationFinish={this.goNext}
          />
        </View>
      );
    }

    return (
      <View key={item} style={styles.days}>
        <Text style={styles.daysText}>{item.charAt(0)}</Text>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.daysContainer}>
          {DAYS_OF_THE_WEEK.map((item) => this.getDays(item))}
        </View>
        <View style={styles.streakContainer}>
          <Text style={styles.streak}>1 consecutive day</Text>
        </View>
      </View>
    );
  }
}
export default MeasurementSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  days: {
    height: 34,
    width: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
    backgroundColor: '#252a43',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 3,
  },
  daysText: {
    fontFamily: FontType.Light,
    fontSize: 20,
    color: '#787989',
  },
  darkText: {
    color: '#252a43',
  },
  animContainer: {
    paddingHorizontal: 6,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 3,
  },
  anim: {
    height: 34,
    width: 34,
  },
  white: {
    backgroundColor: 'white',
  },
  dark: {
    backgroundColor: '#252a43',
  },
  streakContainer: {
    marginTop: 40,
  },
  streak: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
});
