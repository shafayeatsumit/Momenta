import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FontType} from '../../helpers/theme';
import BreathingGame from '../breathingGame/BreathingGame';

const TOTAL_BREATHS = 3;

class MeasurementBreaths extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressCount: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
    };
  }

  shouldGoNext = () => {
    const {progressCount} = this.state;
    if (progressCount === TOTAL_BREATHS) {
      this.props.goNext();
    }
  };

  breathCompleted = (inhaleTime, exhaleTime) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        totalInhaleTime: prevState.totalInhaleTime + inhaleTime,
        totalExhaleTime: prevState.totalExhaleTime + exhaleTime,
        progressCount: prevState.progressCount + 1,
      };
    }, this.shouldGoNext);
  };

  render() {
    const {progressCount} = this.state;
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
export default MeasurementBreaths;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    position: 'absolute',
    top: '5%',
    height: 40,
    width: 100,
    alignSelf: 'center',
    zIndex: 1,
  },
  progressText: {
    fontFamily: FontType.Light,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  progressTextBig: {
    fontSize: 36,
  },
});
