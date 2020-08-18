import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styles from './Onboarding.styles';
import Slogan from './Slogan';
import IntroVideo from './IntroVideo';
import IntroBreath from './IntroBreath';

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'introBreath',
    };
  }

  render() {
    const {screen} = this.state;
    return (
      <View style={styles.container}>
        {screen === 'slogan' && <Slogan />}
        {screen === 'introVideo' && <IntroVideo />}
        {screen === 'introBreath' && <IntroBreath />}
      </View>
    );
  }
}
export default Onboarding;
