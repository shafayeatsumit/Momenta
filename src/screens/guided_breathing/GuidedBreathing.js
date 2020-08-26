import React, {Component} from 'react';
import {View, Text} from 'react-native';

import CheckInBreath from './CheckInBreath';
import BreathingGame from './BreathingGame';

import {connect} from 'react-redux';

class GuidedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCheckInBreath: false,
      showBreathingGame: true,
    };
  }

  goToBreathingGame = (avgInhaleTime, avgExhaleTime) => {
    this.props.dispatch({
      type: 'UPDATE_CHECKIN_TIME',
      inhaleTime: avgInhaleTime,
      exhaleTime: avgExhaleTime,
    });
    this.setState({showCheckInBreath: false, showBreathingGame: true});
    console.log(`avgInhaleTime${avgInhaleTime} avgExhale ${avgExhaleTime}`);
  };

  render() {
    const {showCheckInBreath, showBreathingGame} = this.state;
    return (
      <>
        {showCheckInBreath && (
          <CheckInBreath goToBreathingGame={this.goToBreathingGame} />
        )}
        {showBreathingGame && <BreathingGame />}
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
