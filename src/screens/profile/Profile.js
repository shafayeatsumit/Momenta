import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import moment from 'moment';
import leftArrowIcon from '../../../assets/icons/arrow_left.png';
import LottieView from 'lottie-react-native';
import styles from './Profile.styles';

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

class Profile extends Component {
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

    return (
      <View key={item} style={styles.days}>
        <Text style={styles.daysText}>{item.charAt(0)}</Text>
      </View>
    );
  };

  goHome = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.leftIconContainer}
          onPress={this.goHome}>
          <Image source={leftArrowIcon} style={styles.leftIcon} />
        </TouchableOpacity>
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
export default Profile;
