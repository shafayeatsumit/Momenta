import React, {Component} from 'react';
import {
  View,
  Text,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Modal,
  AppState,
} from 'react-native';
import {connect} from 'react-redux';
import {
  fetchTags,
  fetchBackground,
  anonymousSignup,
  removeBackground,
} from '../../redux/actions/tag';
import BrethingGame from '../breathingGame/BreathingGame';
import PersonalizeModal from './modals/OboardingPersonalize';
import TodaysFocusModal from './modals/TodaysFocus';
import EndSessionModal from './modals/EndSessionModal';
import moment from 'moment-timezone';
import styles from './Home.styles';
import {getTodaysDate} from '../../helpers/common';
import analytics from '@react-native-firebase/analytics';
import LottieView from 'lottie-react-native';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breathingGameVisible: true,
      personalizeModalVisible: false,
      todaysFocusVisible: false,
      endSessionModalVisible: false,
      appState: AppState.currentState,
      pressInParent: false,
    };
    this.imageOpacity = new Animated.Value(1);
    // time
    this.pressInTime = null;
    this.pressOutTime = null;
  }

  checkOnboardingModal = () => {
    const {currentSession, onboarding, settings, dispatch} = this.props;
    if (onboarding.breathingTutorial && currentSession.breathCount === 3) {
      this.setState({personalizeModalVisible: true});
    } else if (currentSession.breathCount === settings.breathPerSession) {
      this.setState({endSessionModalVisible: true});
    } else {
      this.goToNextBreathing();
    }
  };

  nextBreathing = () => {
    const {onboarding, dispatch, settings} = this.props;
    if (onboarding.completed) {
      // TODO: uncomment this
      const {currentSession} = this.props;
      const totalBreath =
        settings.breathPerSession + currentSession.additionalBreath;
      if (currentSession.breathCount === totalBreath) {
        this.setState({endSessionModalVisible: true});
      } else {
        this.goToNextBreathing();
      }
    } else {
      this.checkOnboardingModal();
    }
  };

  openFocus = () =>
    this.setState({
      personalizeModalVisible: false,
      endSessionModalVisible: false,
      todaysFocusVisible: true,
    });

  closeEndSessionModal = () => this.setState({endSessionModalVisible: false});

  closeTodaysFocus = () => {
    this.setState({todaysFocusVisible: false, breathingGameVisible: true});
  };

  imageFadeOut = () => {
    const {settings} = this.props;
    const {exhaleTime} = settings;
    Animated.timing(this.imageOpacity, {
      toValue: 0,
      duration: exhaleTime * 1000,
      useNativeDriver: true,
    }).start(this.nextBreathing);
  };

  closeBreathingGame = () => this.setState({breathingGameVisible: false});

  showBreathingGame = () => {
    this.setState({breathingGameVisible: true});
    this.imageOpacity.setValue(1);
  };

  showTodaysFocus = () => this.setState({todaysFocusVisible: true});

  checkTodaysFocus = () => {
    const {breathing} = this.props;
    const today = getTodaysDate();
    const itsANewDay = breathing.lastBreathingTipSeen !== today;
    const todayWithFocusOn =
      breathing.lastBreathingTipSeen === today && breathing.showTips;
    const showFocus = itsANewDay || todayWithFocusOn;
    showFocus && this.showTodaysFocus();
  };

  showBreathingGameWithDelay = () => {
    this.breathingDelayId = setTimeout(() => {
      this.showBreathingGame();
      clearTimeout(this.breathingDelayId);
    }, 300);
  };

  goToNextBreathing = () => {
    const {dispatch} = this.props;
    this.closeBreathingGame();
    dispatch(fetchBackground());
    dispatch(removeBackground()).then(() => {
      this.showBreathingGameWithDelay();
    });
  };

  openBreathingGame = () => {
    this.openBreathingGameID = setTimeout(() => {
      this.setState({breathingGameVisible: true});
      this.imageOpacity.setValue(1);
      this.openBreathingGameID && clearTimeout(this.openBreathingGameID);
    }, 500);
  };

  handlePressIn = () => {
    const {settings, backgrounds} = this.props;
    const backgroundId = backgrounds[0] ? backgrounds[0].id : null;
    this.pressInTime = new Date();
    if (this.pressOutTime) {
      const timeTakenExhale = ((new Date() - this.pressOutTime) / 1000).toFixed(
        1,
      );
      const date = new Date();
      const dateInMS = date.getTime();
      console.log('inhale event fired');
      analytics().logEvent('inhale', {
        time: dateInMS,
        time_taken: Number(timeTakenExhale),
        exhale_time: settings.exhaleTime,
        background_id: backgroundId,
      });
    }
    this.setState({pressInParent: true, pressOutParent: false});
  };

  handlePressOut = () => {
    const {settings, backgrounds} = this.props;
    const backgroundId = backgrounds[0] ? backgrounds[0].id : null;
    this.pressOutTime = new Date();
    const timeTakeInhale = ((new Date() - this.pressInTime) / 1000).toFixed(1);
    const date = new Date();
    const dateInMS = date.getTime();
    console.log('exhale event fired');
    analytics().logEvent('exhale', {
      time: dateInMS,
      time_taken: Number(timeTakeInhale),
      inhale_time: settings.inhale_time,
      background_id: backgroundId,
    });
    this.setState({pressOutParent: true, pressInParent: false});
  };

  handleAppStateChange = (nextAppState) => {
    const {endSessionModalVisible} = this.state;
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      const {dispatch, onboarding} = this.props;
      dispatch({type: 'RESET_BREATH_COUNT'});
      endSessionModalVisible && this.setState({endSessionModalVisible: false});
      onboarding.completed && this.checkTodaysFocus();
    }
    this.setState({appState: nextAppState});
  };

  componentDidMount() {
    const {userInfo, dispatch, sets, onboarding} = this.props;
    const hasSets = Object.keys(sets).length;
    if (!userInfo.token) {
      dispatch(anonymousSignup());
    } else {
      !hasSets && dispatch(fetchTags());
    }
    userInfo.userId && analytics().setUserId(userInfo.userId.toString());
    AppState.addEventListener('change', this.handleAppStateChange);
    onboarding.completed && this.checkTodaysFocus();
  }

  componentWillUnmount() {
    this.slideTimerId && clearTimeout(this.slideTimerId);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  render() {
    const {backgrounds, navigation} = this.props;
    const {
      breathingGameVisible,
      personalizeModalVisible,
      todaysFocusVisible,
      endSessionModalVisible,
    } = this.state;
    const backgroundImage = backgrounds[0];

    if (!backgroundImage) {
      return (
        <View style={styles.loadingContainer}>
          <LottieView
            autoSize
            autoPlay
            loop
            source={require('../../../assets/anims/breath.json')}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Animated.Image
          style={[styles.imageContainer, {opacity: this.imageOpacity}]}
          source={backgroundImage.uri}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={personalizeModalVisible}>
          <PersonalizeModal
            goToNextBreathing={this.goToNextBreathing}
            closeModal={this.openFocus}
          />
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={endSessionModalVisible}>
          <EndSessionModal
            closeModal={this.closeEndSessionModal}
            openFocus={this.openFocus}
            goToNextBreathing={this.goToNextBreathing}
          />
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={todaysFocusVisible}>
          <TodaysFocusModal closeModal={this.closeTodaysFocus} />
        </Modal>
        {breathingGameVisible ? (
          <View style={styles.breathingGameContainer}>
            <BrethingGame
              backgroundImage={backgroundImage}
              imageFadeOut={this.imageFadeOut}
              navigation={navigation}
              pressInParent={this.state.pressInParent}
              pressOutParent={this.state.pressOutParent}
            />
          </View>
        ) : null}

        <TouchableOpacity
          onPressIn={this.handlePressIn}
          onPressOut={this.handlePressOut}
          style={styles.touchHandler}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    sets,
    tags,
    tagNames,
    backgrounds,
    userInfo,
    settings,
    onboarding,
    breathing,
    currentSession,
  } = state;
  return {
    sets,
    tags,
    tagNames,
    breathing,
    backgrounds,
    userInfo,
    settings,
    onboarding,
    currentSession,
  };
};

export default connect(mapStateToProps)(Home);
