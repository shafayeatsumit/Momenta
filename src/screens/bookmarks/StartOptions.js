import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import styles from './Bookmarks.styles';
import ShuffleIcon from '../../../assets/icons/shuffle.png';

const StartOptions = ({handleStart, handleShuffle, shuffle}) => (
  <View style={styles.buttonHolder}>
    <TouchableOpacity style={styles.startButton} onPress={handleStart}>
      <Text style={styles.start}>START</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleShuffle}>
      <Image
        source={ShuffleIcon}
        style={[styles.shuffle, shuffle && {tintColor: 'rgb(60,113,222)'}]}
      />
    </TouchableOpacity>
  </View>
);
export default StartOptions;
