import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styles from './Onboarding.styles';
import Slogan from './Slogan';
import IntroVideo from './IntroVideo';
import IntroBreath from './IntroBreath';
import ImpNotes from './ImpNotes';
import MeasurementBreaths from './MeasurementBreaths';
import MeasurementSuccess from './MeasurementSuccess';
import Reason from './Reason';
import {connect} from 'react-redux';

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'slogan',
    };
  }

  goToIntroBreath = () => this.setState({screen: 'introBreath'});
  goToImpNotes = () => this.setState({screen: 'impNotes'});
  goToMeasurementBreaths = () => this.setState({screen: 'measurementBreaths'});
  goToMeasurementSuccess = () => this.setState({screen: 'measurementSuccess'});
  goToIntroVideo = () => this.setState({screen: 'introVideo'});
  goToReason = () => this.setState({screen: 'reason'});
  goToProfile = () => {
    this.props.dispatch({type: 'ONBOARDING_COMPLETED'});
    this.props.navigation.navigate('Profile');
  };

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.goToIntroVideo();
      clearTimeout(this.timerId);
    }, 3000);
  }

  render() {
    const {screen} = this.state;
    return (
      <View style={styles.container}>
        {screen === 'slogan' && <Slogan />}
        {screen === 'introVideo' && (
          <IntroVideo goNext={this.goToIntroBreath} />
        )}
        {screen === 'introBreath' && <IntroBreath goNext={this.goToImpNotes} />}
        {screen === 'impNotes' && (
          <ImpNotes goNext={this.goToMeasurementBreaths} />
        )}
        {screen === 'measurementBreaths' && (
          <MeasurementBreaths goNext={this.goToMeasurementSuccess} />
        )}
        {screen === 'measurementSuccess' && (
          <MeasurementSuccess goNext={this.goToReason} />
        )}
        {screen === 'reason' && <Reason goNext={this.goToProfile} />}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    onboarding: state.onboarding,
  };
};

export default connect(mapStateToProps)(Onboarding);
