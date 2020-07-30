import React, {Component} from 'react';
import {StyleSheet, View, Modal, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {Colors} from '../../../helpers/theme';
import TodaysFocus from './TodaysFocus';
import Meditation from './Meditation';
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
      successAndRewardVisible: false,
      checkMarkModal: false,
      streak: null,
      thisWeekMomenta: [],
      userCount: null,
    };
  }

  closeMediation = () => {
    this.props.dispatch({type: 'RESET_BREATH_COUNT'});
    const {currentSession} = this.props;
    this.setState({
      meditationVisible: false,
      successAndRewardVisible: true,
      additionalBreath: currentSession.additionalBreath,
    });
  };

  closeCheckMarkModal = () => {
    this.props.dispatch({type: 'RESET_BREATH_COUNT'});
    this.setState({checkMarkModal: false, successAndRewardVisible: true});
  };

  closeSuccessAndReward = () => {
    const {showTodaysFocus} = this.state;
    if (showTodaysFocus) {
      this.props.openFocus();
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
    showMeditation
      ? this.setState({meditationVisible: true})
      : this.setState({checkMarkModal: true});
  };

  getProgress = () => {
    const {settings, currentSession} = this.props;
    const totalBreathThisSession =
      settings.breathPerSession + currentSession.additionalBreath;
    return `${currentSession.breathCount}/${totalBreathThisSession}`;
  };

  componentDidMount() {
    this.checkForReward();
    this.checkMeditation();
    this.checkTodaysFocus();
  }

  componentWillUnmount() {
    this.timerId && clearTimeout(this.timerId);
  }

  render() {
    const {
      meditationVisible,
      successAndRewardVisible,
      checkMarkModal,
      streak,
      thisWeekMomenta,
      userCount,
      additionalBreath,
    } = this.state;
    const {settings} = this.props;

    return (
      <View style={styles.mainContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={meditationVisible}>
          <Meditation
            goToNextModal={this.closeMediation}
            closeModal={this.props.closeModal}
            goToNextBreathing={this.props.goToNextBreathing}
          />
        </Modal>

        <Modal animationType="fade" transparent={true} visible={checkMarkModal}>
          <CheckMark
            goToNextModal={this.closeCheckMarkModal}
            closeModal={this.props.closeModal}
            goToNextBreathing={this.props.goToNextBreathing}
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
            additionalBreath={additionalBreath}
          />
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {settings, currentSession, breathing, onboarding} = state;

  return {
    settings,
    currentSession,
    breathing,
    onboarding,
    selectedTags: settings.selectedTags,
  };
};

export default connect(mapStateToProps)(EndSessionModal);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
  },
});
