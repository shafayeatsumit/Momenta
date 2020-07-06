import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';

const InhaleTimePicker = (props) => (
  <View style={styles.container}>
    <Text>InhaleTimePicker</Text>
  </View>
);
export default InhaleTimePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
