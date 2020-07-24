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

class EndSessionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meditationVisible: false,
      showTodaysFocus: false,
      todaysFocusVisible: false,
      successAndRewardVisible: false,
      checkMarkModal: false,
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

  checkMeditation = () => {
    const {selectedTags} = this.props;
    const showMeditation = selectedTags.length > 0;
    showMeditation
      ? this.setState({meditationVisible: true})
      : this.setState({checkMarkModal: true});
  };

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.props.goToNextBreathing();
      clearTimeout(this.timerId);
    }, 1000);
    this.checkTodaysFocus();
    this.checkMeditation();
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
    } = this.state;
    return (
      <View style={styles.mainContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={meditationVisible}>
          <MiniMeditation closeModal={this.closeMediation} />
        </Modal>
        <Modal animationType="fade" transparent={true} visible={checkMarkModal}>
          <MiniMeditation closeModal={this.closeCheckMarkModal} />
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={successAndRewardVisible}>
          <SuccessAndReward closeModal={this.closeSuccessAndReward} />
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
});
