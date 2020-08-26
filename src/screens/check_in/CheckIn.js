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
    const {totalInhaleTime, totalExhaleTime, progressCount} = this.state;

    const avgInhaleTime = totalInhaleTime / progressCount;
    const avgExhaleTime = totalExhaleTime / progressCount;
    console.log('progress', progressCount);
    console.log('total inhaletime +++>', avgInhaleTime);
    console.log('total exhaletime +++>', avgExhaleTime);
    this.props.dispatch({
      type: 'UPDATE_CHECKIN_TIME',
      inhaleTime: avgInhaleTime,
      exhaleTime: avgExhaleTime,
    });
    // TODO: change stuff in here.
    // this.props.navigation.navigate('Home');
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
    if (progressCount === 3) {
      this.setState({showCheckMark: true}, this.handleFinish);
      console.log('show Guided Breathing Early');
    }
  };

  goToGuidedBreathing = () => {
    const {showCheckMark} = this.state;
    console.log('show checkmark', showCheckMark);
    !showCheckMark && this.setState({showCheckMark: true}, this.handleFinish);
    console.log('show Guided Breathing Later');
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
      <>
        {showCheckMark ? (
          <View style={styles.checkmarkContainer}>
            <LottieView
              autoSize={false}
              autoPlay
              loop={false}
              style={styles.checkmark}
              resizeMode="cover"
              source={require('../../../assets/anims/check_mark.json')}
              // onAnimationFinish={this.checkmarkAnimationFinish}
            />
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.progressContainer} pointerEvents="none">
              <Text allowFontScaling={false} style={styles.progressText}>
                <Text style={[styles.progressText, styles.progressTextBig]}>
                  {progressCount}
                  <Text style={styles.progressText}>/{TOTAL_BREATHS}</Text>
                </Text>
              </Text>
            </View>
            <BreathingGame
              breathCompleted={this.breathCompleted}
              redoBreathing={this.redoBreathing}
              progressCount={progressCount}
              totalExhaleTime={totalExhaleTime}
              goToGuidedBreathing={this.goToGuidedBreathing}
            />
          </View>
        )}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    checkin: state.checkin,
  };
};

export default connect(mapStateToProps)(CheckIn);
