import React, {Component} from 'react';
import {View, Text} from 'react-native';
import BreathingGame from '../breathingGame/BreathingGame';
import CheckinSuccess from './CheckinSuccess';
import styles from './CheckIn.styles';

const TOTAL_BREATHS = 3;

class CheckIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressCount: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
      showResult: false,
    };
  }

  handleFinish = () => {
    this.props.navigation.navigate('Home');
  };

  shouldShowResult = () => {
    const {progressCount} = this.state;
    if (progressCount === TOTAL_BREATHS) {
      this.timerId = setTimeout(() => {
        this.setState({showResult: true});
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
    }, this.shouldShowResult);
  };

  render() {
    const {
      totalInhaleTime,
      totalExhaleTime,
      progressCount,
      showResult,
    } = this.state;
    if (showResult) {
      return (
        <CheckinSuccess
          inhaleTime={totalInhaleTime}
          exhaleTime={totalExhaleTime}
          goNext={this.handleFinish}
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
export default CheckIn;
