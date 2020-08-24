import React, {Component} from 'react';
import {View, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import BreathingGame from './Breathing';
import BreathingStats from './BreathingStats';
import styles from './GuidedBreathing.styles';
import {connect} from 'react-redux';

class GuidedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressCount: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
      showStats: false,
      showCheckMark: false,
    };
  }

  handleFinish = () => {
    this.props.navigation.replace('Home');
  };

  redoBreathing = () => {
    this.setState({
      // showStats: false,
      progressCount: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
    });
  };

  checkmarkAnimationFinish = () => {
    this.setState({showCheckMark: false, showStats: true});
  };

  showCheckMark = () => {
    this.timerId = setTimeout(() => {
      this.setState({showCheckMark: true});
      clearTimeout(this.timerId);
    }, 1500);
  };

  breathCompleted = (inhaleTime, exhaleTime) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        totalInhaleTime: prevState.totalInhaleTime + Number(inhaleTime),
        totalExhaleTime: prevState.totalExhaleTime + Number(exhaleTime),
        progressCount: prevState.progressCount + 1,
      };
    });
  };

  render() {
    const {
      totalInhaleTime,
      totalExhaleTime,
      progressCount,
      showStats,
      showCheckMark,
    } = this.state;

    const {totalBreaths} = this.props.courses;

    if (showStats) {
      return (
        <BreathingStats
          totalBreaths={progressCount}
          checkin={this.props.checkin}
          inhaleTime={totalInhaleTime}
          exhaleTime={totalExhaleTime}
          goNext={this.handleFinish}
        />
      );
    }

    if (showCheckMark) {
      return (
        <View style={styles.checkmarkContainer}>
          <LottieView
            autoSize={false}
            autoPlay
            loop={false}
            style={styles.checkmark}
            resizeMode="cover"
            source={require('../../../assets/anims/check_mark.json')}
            onAnimationFinish={this.checkmarkAnimationFinish}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.progressContainer} pointerEvents="none">
          <Text allowFontScaling={false} style={styles.progressText}>
            <Text style={[styles.progressText, styles.progressTextBig]}>
              {progressCount}
              <Text style={styles.progressText}>/{totalBreaths}</Text>
            </Text>
          </Text>
        </View>
        <BreathingGame
          breathCompleted={this.breathCompleted}
          finishBreathing={this.showCheckMark}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    courses: state.courses,
    checkin: state.checkin,
  };
};

export default connect(mapStateToProps)(GuidedBreathing);
