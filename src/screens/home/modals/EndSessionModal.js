import React, {Component} from 'react';
import {StyleSheet, View, Modal, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import TodaysFocus from './TodaysFocus';
import MiniMeditation from './MiniMeditation';
import SuccessAndReward from './SuccessAndReward';
import CheckMark from './CheckMark';
import {connect} from 'react-redux';
import {getTodaysDate} from '../../../helpers/common';
import {api} from '../../../helpers/api';

class EndSessionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meditationVisible: false,
      showTodaysFocus: false,
      todaysFocusVisible: false,
      successAndRewardVisible: false,
      checkMarkModal: false,
      streak: null,
      thisWeekMomenta: [],
      userCount: null,
    };
  }

  closeMediation = () => {
    this.props.dispatch({type: 'RESET_BREATH_COUNT'});
    this.setState({meditationVisible: false, successAndRewardVisible: true});
  };

  closeCheckMarkModal = () => {
    this.props.dispatch({type: 'RESET_BREATH_COUNT'});
    this.setState({checkMarkModal: false, successAndRewardVisible: true});
  };

  closeSuccessAndReward = () => {
    const {showTodaysFocus} = this.state;
    if (showTodaysFocus) {
      this.setState({
        successAndRewardVisible: false,
        todaysFocusVisible: true,
      });
    } else {
      this.props.closeModal();
    }
  };

  checkTodaysFocus = () => {
    const {breathing, dispatch} = this.props;
    const today = getTodaysDate();
    const itsANewDay = breathing.lastBreathingTipSeen !== today;
    const todayWithFocusOn =
      breathing.lastBreathingTipSeen === today && breathing.showTips;
    const showFocus = itsANewDay || todayWithFocusOn;
    if (showFocus) {
      this.setState({showTodaysFocus: true});
    }
    if (itsANewDay && !todayWithFocusOn) {
      dispatch({type: 'TODAYS_FOCUS_ON'});
    }
  };

  checkForReward = () => {
    const url = 'user_momenta/';
    api
      .post(url, {})
      .then((response) => {
        const {streak, thisWeekMomenta, userCount} = response.data;
        this.setState({
          streak,
          thisWeekMomenta,
          userCount,
        });
      })
      .catch((error) => console.log(error));
  };

  checkMeditation = () => {
    const {selectedTags} = this.props;
    const showMeditation = selectedTags.length > 0;
    this.setState({checkMarkModal: true});
    // TODO: uncomment the following
    // showMeditation
    //   ? this.setState({meditationVisible: true})
    //   : this.setState({checkMarkModal: true});
  };

  getProgress = () => {
    const {settings, currentSession} = this.props;
    const totalBreathThisSession =
      settings.breathPerSession + currentSession.additionalBreath;
    return `${currentSession.breathCount}/${totalBreathThisSession}`;
  };

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.props.goToNextBreathing();
      clearTimeout(this.timerId);
    }, 1000);
    this.checkTodaysFocus();
    this.checkMeditation();
    this.checkForReward();
  }

  componentWillUnmount() {
    this.timerId && clearTimeout(this.timerId);
  }

  render() {
    const {
      meditationVisible,
      todaysFocusVisible,
      successAndRewardVisible,
      checkMarkModal,
      streak,
      thisWeekMomenta,
      userCount,
    } = this.state;
    const {settings} = this.props;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.progressContainer} pointerEvents="none">
          <Text style={styles.progressText}>{this.getProgress()}</Text>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={meditationVisible}>
          <MiniMeditation
            openSuccessModal={this.closeCheckMarkModal}
            closeModal={this.closeMediation}
          />
        </Modal>

        <Modal animationType="fade" transparent={true} visible={checkMarkModal}>
          <CheckMark
            goToNextModal={this.closeCheckMarkModal}
            closeModal={this.props.closeModal}
          />
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={successAndRewardVisible}>
          <SuccessAndReward
            closeModal={this.closeSuccessAndReward}
            streak={streak}
            thisWeekMomenta={thisWeekMomenta}
            userCount={userCount}
            breathPerSession={settings.breathPerSession}
          />
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={todaysFocusVisible}>
          <TodaysFocus closeModal={this.props.closeModal} />
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {settings, currentSession, breathing} = state;

  return {
    settings,
    currentSession,
    breathing,
    selectedTags: settings.selectedTags,
  };
};

export default connect(mapStateToProps)(EndSessionModal);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1b1f37',
  },
  progressContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  progressText: {
    fontFamily: FontType.SemiBold,
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    paddingTop: 18,
  },
});
