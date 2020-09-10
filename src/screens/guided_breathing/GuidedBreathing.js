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
    console.log('here');
    this.setState({showBreathingGame: false});
    this.props.navigation.pop();
  };

  goToBreathingGame = (avgExhaleTime, avgInhaleTime) => {
    this.props.dispatch({
      type: 'UPDATE_CALIBRATION_TIME',
      calibrationExhale: avgExhaleTime,
      calibrationInhale: avgInhaleTime,
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
          <CheckInBreath
            goToBreathingGame={this.goToBreathingGame}
            musicOn={musicOn}
            handleMusic={route.params.handleMusic}
          />
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
