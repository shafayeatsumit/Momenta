import React, {Component} from 'react';
import CheckInBreath from './CheckInBreath';
import BreathingGame from './BreathingGame';
import {connect} from 'react-redux';

class GuidedBreathing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCheckInBreath: true,
      showBreathingGame: false,
    };
  }

  finish = () => {
    this.props.navigation.pop();
  };

  goToBreathingGame = (avgInhaleTime, avgExhaleTime) => {
    this.props.dispatch({
      type: 'UPDATE_CALIBRATION_TIME',
      calibrationInhale: avgInhaleTime,
      calibrationExhale: avgExhaleTime,
    });
    this.setState({showCheckInBreath: false, showBreathingGame: true});
  };

  render() {
    const {showCheckInBreath, showBreathingGame} = this.state;
    const {userInfo} = this.props;
    const {musicOn} = userInfo;
    const {route} = this.props;

    return (
      <>
        {showCheckInBreath && (
          <CheckInBreath goToBreathingGame={this.goToBreathingGame} />
        )}
        {showBreathingGame && (
          <BreathingGame
            finish={this.finish}
            musicOn={musicOn}
            handleMusic={route.params.handleMusic}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    guidedBreathing: state.guidedBreathing,
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps)(GuidedBreathing);
