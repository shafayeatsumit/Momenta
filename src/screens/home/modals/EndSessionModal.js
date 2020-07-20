import React, {Component} from 'react';
import {StyleSheet, View, Modal, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import TodaysFocus from './TodaysFocus';
import MiniMeditation from './MiniMeditation';
import SuccessAndReward from './SuccessAndReward';
import {connect} from 'react-redux';
import {getTodaysDate} from '../../../helpers/common';

class EndSessionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meditationVisible: props.selectedTags.length > 0,
      showTodaysFocus: false,
      todaysFocusVisible: false,
      successAndRewardVisible: false,
    };
  }

  closeMediation = () =>
    this.setState({meditationVisible: false, successAndRewardVisible: true});

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
    const {breathing, settings} = this.props;
    const today = getTodaysDate();
    const itsANewDay = breathing.lastBreathTaken !== today;
    const todayWithFocusOn =
      breathing.lastBreathTaken === today && settings.todaysFocusOn;
    const showFocus = itsANewDay || todayWithFocusOn;
    showFocus && this.setState({showTodaysFocus: true});
  };

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.props.goToNextBreathing();
      clearTimeout(this.timerId);
    }, 1000);
    this.checkTodaysFocus();
  }

  componentWillUnmount() {
    this.timerId && clearTimeout(this.timerId);
  }

  render() {
    const {
      meditationVisible,
      todaysFocusVisible,
      successAndRewardVisible,
    } = this.state;
    return (
      <View style={styles.mainContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={meditationVisible}>
          <MiniMeditation closeModal={this.closeMediation} />
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
