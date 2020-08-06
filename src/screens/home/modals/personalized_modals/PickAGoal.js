import React, {Component} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {FontType, Colors} from '../../../../helpers/theme';
import {ScreenHeight} from '../../../../helpers/constants/common';
import analytics from '@react-native-firebase/analytics';

const PickAGoal = ({goNext}) => {
  const handlePress = (goal) => {
    var date = new Date();
    var dateInMS = date.getTime();
    analytics().logEvent('picked_a_goal', {
      goal: goal,
      time: dateInMS,
    });
    goNext();
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text} allowFontScaling={false}>
          Each day you'll get a focus based on yoga practices and the latest
          science to help you achieve your goal.{'\n'}Pick one:
        </Text>
        <Text style={styles.textSmall} allowFontScaling={false}>
          You can change this later
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          style={styles.button}
          underlayColor={Colors.cornflowerBlue}
          onPress={() => handlePress('calmer_breathing')}>
          <Text style={styles.buttonText}>Calmer breathing</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          underlayColor={Colors.cornflowerBlue}
          onPress={() => handlePress('reduce_overall_stress')}>
          <Text style={styles.buttonText}>Reduce overall stress</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          underlayColor={Colors.cornflowerBlue}
          onPress={() => handlePress('go_to_sleep_faster')}>
          <Text style={styles.buttonText}>Go to sleep faster</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};
export default PickAGoal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '20%',
    alignSelf: 'center',
    height: 170,
    width: 270,
    justifyContent: 'space-between',
  },
  button: {
    height: 50,
    width: 280,
    backgroundColor: Colors.darkBlue,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FontType.Regular,
    fontSize: 18,
    color: 'white',
  },
  textContainer: {
    position: 'absolute',
    bottom: ScreenHeight * 0.2 + 200,
    alignSelf: 'center',
    height: 240,
    width: 284,
    justifyContent: 'space-around',
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 24,
    color: 'white',
  },
  textSmall: {
    fontFamily: FontType.Regular,
    fontSize: 14,
    color: 'white',
  },
});
