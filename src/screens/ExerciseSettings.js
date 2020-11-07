import React from 'react';
import PropTypes from 'prop-types';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import ButtonBig from '../components/ButtonBig';
import ButtonSmall from '../components/ButtonSmall';
import {useSelector, useDispatch} from 'react-redux';
import {ScreenWidth} from '../helpers/constants/common';

const ExerciseSettings = (props) => {
  const breathing = useSelector((state) => state.breathing);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.smallButtonContainer}>
        <ButtonSmall title="1 min" />
        <ButtonSmall title="3 min" />
        <ButtonSmall title="5 min" />
      </View>
      <View style={styles.bottomHolder}>
        <ButtonBig title="Continue" />
        <TouchableOpacity style={styles.soundHolder}>
          <Image
            style={styles.sound}
            source={require('../../assets/icons/music.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ExerciseSettings;

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: ScreenWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'yellow',
  },
  smallButtonContainer: {
    height: 50,
    width: ScreenWidth * 0.85,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  bottomHolder: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 35,
    position: 'absolute',
  },
  soundHolder: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    // backgroundColor: 'yellow',
  },
  sound: {
    height: 25,
    width: 25,
    tintColor: 'white',
  },
});
