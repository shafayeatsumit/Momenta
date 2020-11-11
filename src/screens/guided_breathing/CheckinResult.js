import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, FontType} from '../../helpers/theme';
import ButtonSmall from '../../components/ButtonSmall';

const CheckinError = ({inhaleTime, exhaleTime, handleRedo, handleUse}) => (
  <View style={styles.container}>
    <Text style={styles.title}>Calibration</Text>
    <View style={styles.centerTextHolder}>
      <View style={styles.timeHolder}>
        <Text style={styles.timeTitle}>Exhale Time</Text>
        <Text style={styles.time}>
          {exhaleTime} <Text style={styles.seconds}>seconds</Text>
        </Text>
      </View>
      <View style={styles.timeHolder}>
        <Text style={styles.timeTitle}>Inhale Time</Text>

        <Text style={styles.time}>
          {inhaleTime} <Text style={styles.seconds}>seconds</Text>
        </Text>
      </View>
    </View>

    <View style={styles.buttonHolder}>
      <ButtonSmall
        title={'REDO'}
        handlePress={handleRedo}
        containerStyle={{backgroundColor: Colors.betterBlue}}
        titleStyle={{color: Colors.buttonBlue}}
      />
      <ButtonSmall title={'USE'} handlePress={handleUse} />
    </View>
  </View>
);
export default CheckinError;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.betterBlue,
  },
  title: {
    fontFamily: FontType.Medium,
    fontSize: 16,
    color: 'white',
    position: 'absolute',
    top: 30,
  },
  error: {
    fontFamily: FontType.Medium,
    fontSize: 18,
    color: 'white',
    paddingLeft: 40,
    paddingRight: 100,
  },
  buttonHolder: {
    position: 'absolute',
    bottom: 40,
    height: 60,
    width: 280,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  timeTitle: {
    fontFamily: FontType.Medium,
    fontSize: 20,
    color: 'white',
  },
  centerTextHolder: {
    height: 200,
    width: 280,
    // backgroundColor: 'red',
  },
  timeHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    fontFamily: FontType.ExtraBold,
    fontSize: 28,

    paddingVertical: 10,
    color: Colors.buttonBlue,
  },
  seconds: {
    fontFamily: FontType.Medium,
    fontSize: 18,
    paddingVertical: 5,
    color: Colors.buttonBlue,
  },
});