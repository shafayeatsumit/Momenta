import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {FontType, Colors} from '../../../helpers/theme';
import {ScreenWidth, ScreenHeight} from '../../../helpers/constants/common';
import LottieView from 'lottie-react-native';
import {connect} from 'react-redux';
import analytics from '@react-native-firebase/analytics';

class CheckMark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showClose: false,
    };
    this.animationProgress = new Animated.Value(0);
    this.progressOpacity = new Animated.Value(1);
  }

  startAnimation = () => {
    Animated.timing(this.animationProgress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start();
  };

  handleContinue = () => {
    var date = new Date();
    var dateInMS = date.getTime();
    analytics().logEvent('pressed_continue', {
      time: dateInMS,
    });

    const {settings, dispatch, closeModal} = this.props;
    const {breathPerSession} = settings;
    dispatch({type: 'ADD_EXTRA_BREATH', breathCount: breathPerSession});
    closeModal();
  };

  handleFinish = () => {
    this.progressOpacity.setValue(0);
    this.props.goToNextModal();
  };

  getProgress = () => {
    const {settings, currentSession} = this.props;
    const totalBreath =
      settings.breathPerSession + currentSession.additionalBreath;
    return (
      <Text style={[styles.progressText, styles.progressTextBig]}>
        {currentSession.breathCount}
        <Text style={styles.progressText}>/{totalBreath}</Text>
      </Text>
    );
  };

  componentDidMount() {
    const {goToNextBreathing} = this.props;
    // goToNExtBreathing will be undefined in the first time user sees checkmark.
    goToNextBreathing && goToNextBreathing();
    this.startAnimation();
  }

  render() {
    const {onboarding, goToNextModal} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.progressContainer} pointerEvents="none">
          <Animated.Text
            style={[styles.progressText, {opacity: this.progressOpacity}]}>
            {this.getProgress()}
          </Animated.Text>
        </View>
        <LottieView
          source={require('../../../../assets/anims/success.json')}
          progress={this.animationProgress}
          style={styles.checkmark}
        />
        {onboarding.completed ? (
          <View style={styles.smallButtonContainer}>
            <TouchableOpacity
              style={styles.buttonFinish}
              onPress={goToNextModal}>
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonContinue}
              onPress={this.handleContinue}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.bigButton}
            onPress={this.handleFinish}>
            <Text style={styles.bigButtonText}>Finish</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {onboarding, settings, currentSession} = state;
  return {
    onboarding,
    currentSession,
    settings,
  };
};

export default connect(mapStateToProps)(CheckMark);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: '5%',
    height: 40,
    width: 44,
    alignSelf: 'center',
    zIndex: 1,
  },
  progressText: {
    fontFamily: FontType.Light,
    fontSize: 18,
    color: 'rgb(120,121,137)',
    textAlign: 'center',
  },
  progressTextBig: {
    fontSize: 36,
  },
  checkmark: {
    height: 320,
    width: 320,
  },
  smallButtonContainer: {
    position: 'absolute',
    bottom: '10%',
    width: ScreenWidth,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFinish: {
    height: 50,
    width: 147,
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  buttonContinue: {
    height: 51,
    width: 147,
    borderRadius: 25,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cornflowerBlue,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: FontType.Regular,
    color: 'white',
  },
  bigButton: {
    height: 50,
    width: 300,
    borderRadius: 25,
    backgroundColor: Colors.cornflowerBlue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '20%',
  },
  bigButtonText: {
    fontSize: 24,
    fontFamily: FontType.Regular,
    color: 'white',
  },
});
