import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import {FontType} from '../../../helpers/theme';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
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
const last_week_momenta = ['Thursday', 'Tuesday'];
const LETTERS = {
  S: require('../../../../assets/anims/S.json'),
  M: require('../../../../assets/anims/M.json'),
  W: require('../../../../assets/anims/W.json'),
  T: require('../../../../assets/anims/T.json'),
  F: require('../../../../assets/anims/F.json'),
};

const getDay = () => {  
  return moment().format('dddd');
};

class SuccessAndReward extends Component {
  closeModal = () => {
    this.timerId = setTimeout(this.props.closeModal, 5000);
  };

  componentWillUnmount() {
    this.timerId && clearTimeout(this.timerId);
  }

  componentDidMount() {
    this.closeModal();
  }

  getDays = (item) => {
    const firstLetter = item.charAt(0);
    const letterSource = LETTERS[firstLetter];    
    if (item === getDay()) {
      const firstLetter = item.charAt(0);
      const letterSource = LETTERS[firstLetter];      
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
    const {userCount, streak, breathPerSession} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.sucessTitleHolder}>
          <Text style={styles.sucessTitle}>
            {userCount} people meditated with you
          </Text>
        </View>
        <View style={{paddingBottom: 50}}>
          <Text style={styles.streak}>{streak} consecutive days</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          {DAYS_OF_THE_WEEK.map((item) => this.getDays(item))}
        </View>
        <View style={{paddingTop: 50}}>
          <Text style={styles.congratsText}>Congratulations</Text>
          <Text style={styles.congratsText}>
            +{breathPerSession} calm breaths
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1f37',
  },
  sucessTitle: {
    fontFamily: FontType.Medium,
    color: '#787989',
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  streak: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  congratsText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  sucessTitleHolder: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    width: ScreenWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  days: {
    height: 34,
    width: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 7,
    backgroundColor: '#252a43',
  },
  daysText: {
    fontFamily: FontType.Medium,
    fontSize: 20,
    color: '#787989',
  },
  darkText: {
    color: '#252a43',
  },
  checkmark: {
    height: 320,
    width: 320,
  },
  animContainer: {
    paddingHorizontal: 5,
  },
  anim: {
    height: 34,
    width: 34,
  },
  white: {
    backgroundColor: 'white',
  },
  steel: {
    backgroundColor: '#787989',
  },
  dark: {
    backgroundColor: '#252a43',
  },
  finishContainer: {
    height: 50,
    width: 120,
    position: 'absolute',
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 2,
    bottom: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finish: {
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: 20,
  },
});
