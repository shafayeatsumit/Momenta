import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {FontType} from '../../../helpers/theme';
import {ScreenWidth} from '../../../helpers/constants/common';
import LottieView from 'lottie-react-native';
import {connect} from 'react-redux';

class CheckMark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showClose: false,
    };
    this.animationProgress = new Animated.Value(0);
  }

  startAnimation = () => {
    Animated.timing(this.animationProgress, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start();
  };

  handleContinue = () => {
    const {settings, dispatch, closeModal} = this.props;
    const {breathPerSession} = settings;
    dispatch({type: 'ADD_EXTRA_BREATH', breathCount: breathPerSession});
    closeModal();
  };

  componentDidMount() {
    this.startAnimation();
  }

  render() {
    const {onboarding, goToNextModal} = this.props;
    return (
      <View style={styles.container}>
        <LottieView
          source={require('../../../../assets/anims/success.json')}
          progress={this.animationProgress}
          style={styles.checkmark}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={goToNextModal}>
            <Text style={styles.finish}>Finish</Text>
          </TouchableOpacity>
          {onboarding.completed && (
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleContinue}>
              <Text style={styles.finish}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {onboarding, settings} = state;
  return {
    onboarding,
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
  sucessTitle: {
    fontFamily: FontType.Medium,
    color: '#787989',
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  sucessTitleHolder: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    width: ScreenWidth,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  days: {
    height: 34,
    width: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  daysText: {
    fontFamily: FontType.Medium,
    fontSize: 20,
  },
  checkmark: {
    height: 320,
    width: 320,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: ScreenWidth,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    height: 50,
    width: 140,
    // position: 'absolute',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 2,
    bottom: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finish: {
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: 20,
  },
});
