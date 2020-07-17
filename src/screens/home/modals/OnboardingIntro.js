import React, {Component} from 'react';
import {StyleSheet, View, Modal, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import PersonalizedExperience from './PersonalizedExperience';
import FocusExplainer from './FocusExplainer';
import TodaysFocus from './TodaysFocus';

import {connect} from 'react-redux';

class OnboardingIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      personalizedExperience: true,
      progressTrackerVisible: false,
      focusExplainerVisible: false,
      todaysFocusVisible: false,
    };
  }
  closePersonalizeModal = () => {
    this.setState({personalizedExperience: false, focusExplainerVisible: true});
  };

  closeFocusExplainer = () => {
    this.setState({focusExplainerVisible: false, todaysFocusVisible: true});
  };

  closeTodaysFocus = () => this.props.closeModal();

  render() {
    const {
      personalizedExperience,
      focusExplainerVisible,
      todaysFocusVisible,
    } = this.state;
    return (
      <View style={styles.mainContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={personalizedExperience}>
          <PersonalizedExperience closeModal={this.closePersonalizeModal} />
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={focusExplainerVisible}>
          <FocusExplainer closeModal={this.closeFocusExplainer} />
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={todaysFocusVisible}>
          <TodaysFocus closeModal={this.closeTodaysFocus} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1b1f37',
  },
});

const mapStateToProps = (state, ownProps) => {
  const {settings, currentSession} = state;
  return {
    settings,
    currentSession,
  };
};

export default connect(mapStateToProps)(OnboardingIntro);
