import React, {Component} from 'react';
import {StyleSheet, View, Modal, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import MeditationExplainer from './MeditaitonExplainer';
import MiniMeditation from './MiniMeditation';

import {connect} from 'react-redux';

class OnboardingEnd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medExplainerVisible: true,
      minimeditationVisible: false,
      successModalVisible: false,
    };
  }
  closeMedExplainer = () => {
    this.setState({medExplainerVisible: false, minimeditationVisible: true});
  };

  closeMiniMed = () => {
    this.setState({minimeditationVisible: false, successModalVisible: true});
  };

  componentDidMount() {
    this.props.closeBreathingGame();
  }

  render() {
    const {medExplainerVisible, minimeditationVisible} = this.state;
    return (
      <View style={styles.mainContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={medExplainerVisible}>
          <MeditationExplainer closeModal={this.closeMedExplainer} />
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={minimeditationVisible}>
          <MiniMeditation closeModal={this.closeMiniMed} />
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

export default connect(mapStateToProps)(OnboardingEnd);
