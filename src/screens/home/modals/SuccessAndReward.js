import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {FontType} from '../../../helpers/theme';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import LottieView from 'lottie-react-native';
import {api} from '../../../helpers/api';

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

const getDay = () => {
  const options = {weekday: 'long'};
  const date = new Date();
  return date.toLocaleDateString('en-US', options);
};

class SuccessAndReward extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showClose: false,
    };
    this.animationProgress = new Animated.Value(0);
  }

  startAnimation = () => {
    Animated.timing(this.animationProgress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start();
  };

  checkForReward = () => {
    const url = 'user_momenta/';
    api
      .post(url, {})
      .then((response) => {})
      .catch((error) => console.log(error));
  };

  getDays = (item) => {
    // if (item === getDay()) {
    //   return (
    //     <LottieView
    //       style={{
    //         height: 40,
    //         width: 40,
    //       }}
    //       autoSize
    //       source={require('../../../../assets/anims/m1.json')}
    //       autoPlay
    //     />
    //   );
    // }
    const hasMomenta = last_week_momenta.includes(item);
    return (
      <View
        style={[
          styles.days,
          hasMomenta
            ? {backgroundColor: 'white'}
            : {backgroundColor: '#252a43'},
        ]}>
        <Text
          style={[
            styles.daysText,
            hasMomenta ? {color: '#252a43'} : {color: '#787989'},
          ]}>
          {item.charAt(0)}
        </Text>
      </View>
    );
  };

  componentDidMount() {
    this.startAnimation();
    this.checkForReward();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sucessTitleHolder}>
          <Text style={styles.sucessTitle}>15 people meditated with you</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          {DAYS_OF_THE_WEEK.map((item) => this.getDays(item))}
        </View>
        <TouchableOpacity
          style={styles.finishContainer}
          onPress={this.props.closeModal}>
          <Text style={styles.finish}>Close</Text>
        </TouchableOpacity>
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
  },
  sucessTitle: {
    fontFamily: FontType.Medium,
    color: '#787989',
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 30,
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
    marginHorizontal: 5,
  },
  daysText: {
    fontFamily: FontType.Medium,
    fontSize: 20,
  },
  checkmark: {
    height: 320,
    width: 320,
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
