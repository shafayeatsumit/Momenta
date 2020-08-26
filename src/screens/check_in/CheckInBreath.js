import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';

class CheckInBreath extends Component {
  render() {
    return <View style={styles.container} />;
  }
}
export default CheckInBreath;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
