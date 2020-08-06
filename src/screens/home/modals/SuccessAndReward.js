import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import moment from 'moment';
import {FontType, Colors} from '../../../helpers/theme';
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
  S: require('../../../../assets/anims/S.json'),
  M: require('../../../../assets/anims/M.json'),
  W: require('../../../../assets/anims/W.json'),
  T: require('../../../../assets/anims/T.json'),
  F: require('../../../../assets/anims/F.json'),
};

const hapticFeedbackOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: true,
};

const getDay = () => {
  return moment().format('dddd');
};

class SuccessAndReward extends Component {
  closeModal = () => {
    this.timerId = setTimeout(this.props.closeModal, 5000);
  };

  startHapticFeedback = () => {
    ReactNativeHapticFeedback.trigger('selection', hapticFeedbackOptions);
  };

  componentWillUnmount() {
    this.timerId && clearTimeout(this.timerId);
    this.hpFeedbackId && clearTimeout(this.hpFeedbackId);
  }

  componentDidMount() {
    this.hpFeedbackId = setTimeout(() => {
      this.startHapticFeedback();
      clearTimeout(this.hpFeedbackId);
    }, 2500);
    this.closeModal();
  }

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
          />
        </View>
      );
    }
    const hasMomenta = this.props.thisWeekMomenta.includes(item);
    return (
      <View key={item} style={[styles.days, hasMomenta && styles.white]}>
        <Text style={[styles.daysText, hasMomenta && styles.darkText]}>
          {item.charAt(0)}
        </Text>
      </View>
    );
  };

  render() {
    const {userCount, streak, breathPerSession, additionalBreath} = this.props;
    const dayOrDays = streak > 1 ? 'days' : 'day';
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.streak}>
            {streak} consecutive {dayOrDays}
          </Text>
          <View style={styles.daysContainer}>
            {DAYS_OF_THE_WEEK.map((item) => this.getDays(item))}
          </View>
          <View>
            <Text style={styles.congratsText}>Congratulations</Text>
            <Text style={styles.congratsText}>
              +{breathPerSession + additionalBreath} calm breaths
            </Text>
          </View>
        </View>
        <View style={styles.peopleCountContainer}>
          <Text style={styles.peopleCountText}>
            {userCount} people meditated with you
          </Text>
        </View>
      </View>
    );
  }
}
export default SuccessAndReward;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
  },
  box: {
    position: 'absolute',
    top: '30%',
    height: 135,
    width: '100%',
    justifyContent: 'space-between',
  },
  peopleCountContainer: {
    position: 'absolute',
    bottom: '30%',
    alignSelf: 'center',
  },
  peopleCountText: {
    color: 'rgb(120,121,137)',
    fontSize: 16,
    fontFamily: FontType.Regular,
  },
  streak: {
    fontFamily: FontType.Regular,
    color: 'rgb(120,121,137)',
    fontSize: 24,
    textAlign: 'center',
  },
  congratsText: {
    fontFamily: FontType.Light,
    color: 'rgb(120,121,137)',
    fontSize: 14,
    textAlign: 'center',
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
});
