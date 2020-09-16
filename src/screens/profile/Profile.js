import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
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

class Profile extends Component {
  render() {
    return <View style={styles.container} />;
  }
}
export default Profile;
