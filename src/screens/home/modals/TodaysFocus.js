import React, {Component} from 'react';
import {StyleSheet, View, Text, Animated, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';

class TodaysFocus extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.titleOpacity = new Animated.Value(1);
    this.contentOpacity = new Animated.Value(1);
  }

  getProgress = () => {
    const {settings} = this.props;
    return `0/${settings.breathPerSession}`;
  };

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
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{this.getProgress()}</Text>
        </View>
        <View style={styles.titleHolder}>
          <Animated.Text style={[styles.title, {opacity: this.titleOpacity}]}>
            Today's Focus
          </Animated.Text>
        </View>
        <View style={styles.contentHolder}>
          <Animated.Text style={[styles.content, {opacity: this.titleOpacity}]}>
            {this.getTodaysFocus()}
          </Animated.Text>
        </View>
        <TouchableOpacity
          style={styles.startIconContainer}
          onPress={this.props.closeModal}>
          <Text style={styles.start}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dontShow, !showTips && {borderColor: 'red'}]}
          onPress={this.handleDontShow}>
          <Text style={styles.start}>Don’t show again today</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1f37',
  },
  progressContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
  },
  progressText: {
    fontFamily: FontType.SemiBold,
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    paddingTop: 18,
  },
  contentHolder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontFamily: FontType.Bold,
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  title: {
    fontFamily: FontType.ExtraBold,
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
  },
  startIconContainer: {
    height: 45,
    width: 100,
    position: 'absolute',
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 1,
    bottom: 30,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  start: {
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: 20,
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
  titleHolder: {
    position: 'absolute',
    top: ScreenHeight * 0.15,
    left: 0,
    width: ScreenWidth,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
