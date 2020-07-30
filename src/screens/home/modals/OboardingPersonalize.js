import React, {Component} from 'react';
import {StyleSheet, View, Modal, Text, TouchableOpacity} from 'react-native';
import {Colors} from '../../../helpers/theme';
import CheckMarkModal from './CheckMark';
import PersonalizeModal from './personalized_modals/Personalize';
import {connect} from 'react-redux';

class OnboardingPersonalize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successModalVisible: true,
      personalizedExperience: false,
    };
  }

  closeSuccessModal = () => {
    this.props.dispatch({type: 'FINISH_BREATHING_TUTORIAL'});
    this.setState(
      {successModalVisible: false, personalizedExperience: true},
      this.props.goToNextBreathing,
    );
  };

  render() {
    const {personalizedExperience, successModalVisible} = this.state;
    return (
      <View style={styles.mainContainer}>
        {successModalVisible && (
          <CheckMarkModal goToNextModal={this.closeSuccessModal} />
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={personalizedExperience}>
          <PersonalizeModal closeModal={this.props.closeModal} />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
  },
});

const mapStateToProps = (state, ownProps) => {
  const {onboarding} = state;
  return {
    onboarding,
  };
};

export default connect(mapStateToProps)(OnboardingPersonalize);
