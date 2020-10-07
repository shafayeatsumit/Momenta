import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, FontType} from '../../helpers/theme';
import WaveView from '../../components/WaveView';
import {connect} from 'react-redux';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

class CustomExerciseBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waterHeight: 0,
    };
  }

  startAnimation = (exhaleTime) => {
    const interval = exhaleTime / 100;
    this.intervalId = setInterval(() => {
      if (this.state.waterHeight > 150) {
        clearInterval(this.intervalId);
        ReactNativeHapticFeedback.trigger(
          'impactMedium',
          hapticFeedbackOptions,
        );
        this.props.showBreathingGame();
        return;
      }
      this.setState((state) => ({
        waterHeight: state.waterHeight + 1,
      }));
      this._waveRect.setWaterHeight(this.state.waterHeight);
    }, interval);
  };

  componentDidMount() {
    const {calibrationExhale} = this.props.guidedBreathing;
    this.startAnimation(calibrationExhale);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textHolder}>
          <Text style={styles.centerText}>Building your</Text>
          <Text style={styles.centerText}>custom exercise</Text>
        </View>

        <View style={styles.circleHolder}>
          <WaveView
            ref={(ref) => (this._waveRect = ref)}
            style={styles.waveBall}
            H={this.state.waterHeight}
            waveParams={[
              {A: 12, T: 220, fill: Colors.cornflowerBlue},
              // {A: 15, T: 200, fill: '#0087dc'},
              // {A: 20, T: 180, fill: '#1aa7ff'},
            ]}
            animated={true}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    guidedBreathing: state.guidedBreathing,
  };
};

export default connect(mapStateToProps)(CustomExerciseBuilder);

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveBall: {
    width: 150,
    height: 150,

    aspectRatio: 1,
    borderRadius: 75,
    borderWidth: 0.2,
    borderColor: Colors.cornflowerBlue,
    overflow: 'hidden',
  },
  // circleHolder: {
  //   height: 150,
  //   width: 150,
  //   borderRadius: 75,
  //   backgroundColor: Colors.cornflowerBlue,
  // },
  textHolder: {
    height: 90,
    width: 220,
    position: 'absolute',
    bottom: ScreenHeight / 2 + 50,
  },
  centerText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});
