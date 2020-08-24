import React, {Component} from 'react';
import {View, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import BreathingGame from '../breathingGame/BreathingGame';
import CheckinSuccess from './CheckinSuccess';
import styles from './CheckIn.styles';
import {connect} from 'react-redux';
const TOTAL_BREATHS = 3;

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressCount: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
      showResult: false,
      showCheckMark: false,
    };
  }

  handleFinish = () => {
    const {totalInhaleTime, totalExhaleTime} = this.state;
    console.log('total inhaletime +++>', totalInhaleTime);
    console.log('total exhaletime +++>', totalExhaleTime);
    const avgInhaleTime = totalInhaleTime / TOTAL_BREATHS;
    const avgExhaleTime = totalExhaleTime / TOTAL_BREATHS;
    this.props.dispatch({
      type: 'UPDATE_CHECKIN_TIME',
      inhaleTime: avgInhaleTime,
      exhaleTime: avgExhaleTime,
    });
    this.props.navigation.navigate('Home');
  };

  redoBreathing = () => {
    this.setState({
      showResult: false,
      progressCount: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
    });
  };

  checkmarkAnimationFinish = () => {
    this.setState({showCheckMark: false, showResult: true});
  };

  shouldShowCheckMark = () => {
    const {progressCount} = this.state;
    if (progressCount === TOTAL_BREATHS) {
      this.timerId = setTimeout(() => {
        this.setState({showCheckMark: true});
        clearTimeout(this.timerId);
      }, 1000);
    }
  };

  breathCompleted = (inhaleTime, exhaleTime) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        totalInhaleTime: prevState.totalInhaleTime + Number(inhaleTime),
        totalExhaleTime: prevState.totalExhaleTime + Number(exhaleTime),
        progressCount: prevState.progressCount + 1,
      };
    }, this.shouldShowCheckMark);
  };

  render() {
    const {
      totalInhaleTime,
      totalExhaleTime,
      progressCount,
      showResult,
      showCheckMark,
    } = this.state;
    console.log('render checkin', this.props.checkin);

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

    if (showResult) {
      return (
        <CheckinSuccess
          inhaleTime={totalInhaleTime}
          exhaleTime={totalExhaleTime}
          goNext={this.handleFinish}
          redoBreathing={this.redoBreathing}
        />
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.progressContainer} pointerEvents="none">
          <Text allowFontScaling={false} style={styles.progressText}>
            <Text style={[styles.progressText, styles.progressTextBig]}>
              {progressCount}
              <Text style={styles.progressText}>/{TOTAL_BREATHS}</Text>
            </Text>
          </Text>
        </View>
        <BreathingGame breathCompleted={this.breathCompleted} />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    checkin: state.checkin,
  };
};

export default connect(mapStateToProps)(CheckIn);
