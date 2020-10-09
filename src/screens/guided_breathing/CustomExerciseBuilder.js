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
    // changed it from 100 to 150;
    const interval = exhaleTime / 150;
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
          <Text style={styles.centerText}>Creating your exercise</Text>
          {/* <Text style={styles.centerText}>custom exercise</Text> */}
        </View>

        <View>
          <WaveView
            ref={(ref) => (this._waveRect = ref)}
            style={styles.waveBall}
            H={this.state.waterHeight}
            waveParams={[{A: 12, T: 220, fill: Colors.cornflowerBlue}]}
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
