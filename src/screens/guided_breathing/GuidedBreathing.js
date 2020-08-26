import React, {Component} from 'react';
import {View, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import CheckInBreath from './CheckInBreath';
import BreathingStats from './BreathingStats';
import styles from './GuidedBreathing.styles';
import {connect} from 'react-redux';

class GuidedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCheckInBreath: true,
      showBreathingGame: false,
    };
  }

  render() {
    const {showCheckInBreath} = this.state;
    return <>{showCheckInBreath && <CheckInBreath />}</>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    checkin: state.checkin,
  };
};

export default connect(mapStateToProps)(GuidedBreathing);
