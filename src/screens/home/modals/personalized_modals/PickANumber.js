import React from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {FontType, Colors} from '../../../../helpers/theme';
import {ScreenHeight, ScreenWidth} from '../../../../helpers/constants/common';
import {useDispatch} from 'react-redux';

const PickANumber = ({goNext}) => {
  const dispatch = useDispatch();
  const handlePick = (breath) => {
    dispatch({type: 'PICK_BREATH_PER_SESSION', breathCount: breath});
    goNext();
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text} allowFontScaling={false}>
          Pick a number of calm breaths to take with each meditation
        </Text>
        <Text allowFontScaling={false} style={styles.textSmall}>
          You can adjust this later
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          underlayColor={Colors.cornflowerBlue}
          onPress={() => handlePick(3)}
          style={styles.button}>
          <Text style={styles.buttonText}>3</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={Colors.cornflowerBlue}
          onPress={() => handlePick(4)}
          style={[styles.button, styles.buttonMiddle]}>
          <Text style={styles.buttonText}>4</Text>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={Colors.cornflowerBlue}
          onPress={() => handlePick(5)}
          style={styles.button}>
          <Text style={styles.buttonText}>5</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};
export default PickANumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '20%',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 80,
    width: ScreenWidth,
    flexDirection: 'row',
  },
  button: {
    height: 80,
    width: 80,
    backgroundColor: Colors.darkBlue,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonMiddle: {
    marginHorizontal: 25,
  },
  buttonText: {
    fontFamily: FontType.Regular,
    fontSize: 24,
    color: 'white',
  },

  textContainer: {
    position: 'absolute',
    bottom: ScreenHeight * 0.2 + 120,
    alignSelf: 'center',
    height: 200,
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
