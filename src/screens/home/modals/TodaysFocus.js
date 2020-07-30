import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {ScreenHeight} from '../../../helpers/constants/common';
import {FontType, Colors} from '../../../helpers/theme';
import checkIcon from '../../../../assets/icons/check.png';

class TodaysFocus extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.titleOpacity = new Animated.Value(1);
    this.contentOpacity = new Animated.Value(1);
  }

  getTodaysDate = () => {
    const today = new Date();
    const date =
      today.getFullYear() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getDate();
    return date;
  };

  lastSeenFocusTip = (tips) => {
    const tipsSorted = tips.sort(
      (a, b) => new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime(),
    );
    return tipsSorted[0];
  };

  getTodaysFocus = () => {
    const {breathing, dispatch} = this.props;
    const tips = breathing.breathingTips;
    let focusOfTheDay = tips.find(
      (tip) => tip.lastSeen === this.getTodaysDate(),
    );
    if (focusOfTheDay) {
      return focusOfTheDay.tip;
    }
    const notSeenYet = tips.find((tip) => !tip.lastSeen);
    focusOfTheDay = notSeenYet ? notSeenYet : this.lastSeenFocusTip(tips);
    dispatch({type: 'SEEN_BREATHING_TIP', tipId: focusOfTheDay.id});
    return focusOfTheDay.tip;
  };

  handleDontShow = () => {
    const {dispatch} = this.props;
    dispatch({type: 'DONT_SHOW_FOCUS_TODAY'});
  };

  componentDidMount() {
    this.getTodaysFocus();
  }

  render() {
    const {breathing} = this.props;
    const {showTips} = breathing;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.contentHolder}>
          <View style={styles.titleHolder}>
            <Text allowFontScaling={false} style={styles.title}>
              Today’s Focus
            </Text>
          </View>
          <View style={styles.focusTextHolder}>
            <Text allowFontScaling={false} style={styles.focusText}>
              {this.getTodaysFocus()}
            </Text>
          </View>
        </View>
        <View style={styles.dontShowContainer}>
          <TouchableOpacity
            style={styles.checkUncheckButton}
            onPress={this.handleDontShow}>
            {showTips ? (
              <View style={styles.uncheckedBox} />
            ) : (
              <Image source={checkIcon} />
            )}
          </TouchableOpacity>
          <Text allowFontScaling={false} style={styles.dontShowText}>
            Don’t show this again today
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={this.props.closeModal}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  const {settings, breathing} = state;
  return {settings, breathing};
};

export default connect(mapStateToProps)(TodaysFocus);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.betterBlue65,
  },
  contentHolder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
  },

  titleHolder: {
    height: 22,
    width: 325,
    bottom: 46,
    alignSelf: 'center',
  },

  focusTextHolder: {
    height: 235,
    width: 325,
    alignSelf: 'center',
  },
  focusText: {
    fontFamily: FontType.Medium,
    fontSize: 32,
    color: 'white',
  },
  dontShow: {
    height: 70,
    width: 140,
    position: 'absolute',
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 1,
    bottom: 30,
    left: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkUncheckButton: {
    height: 25,
    width: 35,
  },
  dontShowContainer: {
    height: 25,
    width: 300,
    flexDirection: 'row',
    position: 'absolute',
    bottom: ScreenHeight * 0.07 + 70,
    alignSelf: 'center',
    alignItems: 'center',
  },
  dontShowText: {
    fontFamily: FontType.Medium,
    fontSize: 12,
    color: '#6d7278',
  },
  uncheckedBox: {
    height: 25,
    width: 25,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1.5,
  },
  button: {
    height: 50,
    width: 300,
    borderRadius: 25,
    backgroundColor: Colors.cornflowerBlue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '7%',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontFamily: FontType.Regular,
    color: 'white',
  },
});
