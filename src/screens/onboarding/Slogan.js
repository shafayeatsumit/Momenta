import React from 'react';
import {View, Text} from 'react-native';
import styles from './Onboarding.styles';

const Slogan = () => (
  <View style={styles.sloganContainer}>
    <Text style={styles.sloganText}>
      Change your breathing,{'\n'}change your mood
    </Text>
  </View>
);
export default Slogan;
