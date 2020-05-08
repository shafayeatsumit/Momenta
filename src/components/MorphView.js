import React from 'react';
import {View, StyleSheet} from 'react-native';

const MorphView = ({children}) => (
  <View style={styles.container}>
    <View style={styles.topShadow}>
      <View style={styles.bottomShadow}>
        <View style={styles.middleShadow}>{children}</View>
      </View>
    </View>
  </View>
);

export default MorphView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1f37',
  },
  topShadow: {
    shadowColor: 'rgba(128,144,163,0.03)',
    shadowOffset: {
      width: -10,
      height: -10,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: -10,
  },
  middleShadow: {
    shadowColor: 'rgba(8, 16, 33, 0.44)',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 10,
  },
  bottomShadow: {
    shadowColor: 'rgba(175,193,213,0.06)',
    shadowOffset: {
      width: -5,
      height: -5,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: -5,
  },
});

// rgba(128,144,163,0.03) // light
// rgba(8, 16, 33, 0.44) //dark
// rgba(175,193,213,0.06) // light
