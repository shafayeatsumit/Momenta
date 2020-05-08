import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import analytics from '@react-native-firebase/analytics';
const Profile = () => <View style={styles.container} />;
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 100,
    width: 100,
    backgroundColor: 'yellow',
  },
});
