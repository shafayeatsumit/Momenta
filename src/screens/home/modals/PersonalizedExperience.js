import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import {useDispatch} from 'react-redux';
import FocusExplainer from './FocusExplainer';

const PersonalizedExperience = ({closeModal}) => {
  const dispatch = useDispatch();
  const handlePick = (breath) => {
    dispatch({type: 'PICK_BREATH_PER_SESSION', breathCount: breath});
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.modal}>
        <View style={styles.slide}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              Let’s start personalizing your experience {'\n'}
              {'\n'}
              Pick a number of calm and mindful breaths to take
            </Text>
            <Text style={styles.smallText}>You can change this later</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePick(3)}>
              <View style={styles.timeTextContainer}>
                <Text style={styles.timeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePick(4)}>
              <View style={styles.timeTextContainer}>
                <Text style={styles.timeText}>4</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePick(5)}>
              <View style={styles.timeTextContainer}>
                <Text style={styles.timeText}>5</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PersonalizedExperience;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: ScreenWidth * 0.9,
    height: 400,
    borderRadius: 10,
    backgroundColor: '#1b1f37',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#787989',
    overflow: 'hidden',
  },
  slide: {
    flexGrow: 1,
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 30,
  },
  smallText: {
    fontFamily: FontType.Regular,
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    paddingTop: 20,
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  button: {
    height: 60,
    width: 80,
    borderRadius: 5,
    backgroundColor: '#3c71de',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timeText: {
    fontFamily: FontType.Medium,
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
  },
  timeTextSmall: {
    fontFamily: FontType.Medium,
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    lineHeight: 27,
    marginLeft: 1,
  },
});
