import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

const Test = () => {

  return (
    <View style={styles.main}>
      <Text>Hellow</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    height: 80,
    width: 180,
    backgroundColor: 'orange',
  }
});

export default Test;