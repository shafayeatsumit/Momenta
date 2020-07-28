import React, {Component} from 'react';
import {StyleSheet, View, Modal, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import PersonalizedExperience from './PersonalizedExperience';
import FocusExplainer from './FocusExplainer';
import TodaysFocus from './TodaysFocus';
import CheckMarkModal from './CheckMark';
import Swiper from 'react-native-swiper';

import {connect} from 'react-redux';

class OnboardingPersonalize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successModalVisible: true,
      personalizedExperience: false,
      todaysFocusVisible: false,
    };
  }

  closePersonalizeModal = () => {
    const {breathCount} = this.props.currentSession;    
    this.setState({personalizedExperience: false, todaysFocusVisible: true});
  };

  closeSuccessModal = () => {
    this.props.dispatch({type: 'FINISH_BREATHING_TUTORIAL'});
    this.setState(
      {successModalVisible: false, personalizedExperience: true},
      this.props.goToNextBreathing,
    );
  };

  closeTodaysFocus = () => {
    this.setState({todaysFocusVisible: false}, this.props.closeModal);
  };

  getProgress = () => {
    const {settings, currentSession} = this.props;
    return `${currentSession.breathCount}/${settings.breathPerSession}`;
  };

  render() {
    const {
      personalizedExperience,
      todaysFocusVisible,
      successModalVisible,
    } = this.state;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.progressContainer} pointerEvents="none">
          <Text style={styles.progressText}>{this.getProgress()}</Text>
        </View>

        {successModalVisible && (
          <CheckMarkModal goToNextModal={this.closeSuccessModal} />
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={personalizedExperience}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            loop={false}
            dotColor={'#5f6273'}>
            <PersonalizedExperience />
            <FocusExplainer closeModal={this.closePersonalizeModal} />
          </Swiper>
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

const mapStateToProps = (state, ownProps) => {
  const {settings, currentSession} = state;
  return {
    settings,
    currentSession,
  };
};

export default connect(mapStateToProps)(OnboardingPersonalize);
