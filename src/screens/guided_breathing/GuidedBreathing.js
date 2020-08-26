import React, {Component} from 'react';
import {View, Text} from 'react-native';

import CheckInBreath from './CheckInBreath';

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

  goToBreathingGame = (avgInhaleTime, avgExhaleTime) => {
    this.props.dispatch({
      type: 'UPDATE_CHECKIN_TIME',
      inhaleTime: avgInhaleTime,
      exhaleTime: avgExhaleTime,
    });
    console.log(`avgInhaleTime${avgInhaleTime} avgExhale ${avgExhaleTime}`);
  };

  render() {
    const {showCheckInBreath} = this.state;
    return (
      <>
        {showCheckInBreath && (
          <CheckInBreath goToBreathingGame={this.goToBreathingGame} />
        )}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    checkin: state.checkin,
  };
};

export default connect(mapStateToProps)(GuidedBreathing);
