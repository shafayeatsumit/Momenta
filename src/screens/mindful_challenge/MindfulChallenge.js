import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import styles from './MindfulChallenge.styles';

const MindfulChallenge = ({navigation}) => {
  const breathing = useSelector((state) => state.breathing);
  const goBack = () => navigation.goBack();
  return (
    <ImageBackground source={breathing.background} style={styles.background}>
      <View style={styles.titleBox}>
        <Text style={styles.titleSm}>{breathing.name_line_one}</Text>
        <Text style={styles.title}>{breathing.name_line_two}</Text>
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionText}>{breathing.description}</Text>
      </View>
      <TouchableOpacity style={styles.backbuttonHolder} onPress={goBack}>
        <Image
          source={require('../../../assets/icons/arrow_left.png')}
          style={styles.backbutton}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('GuidedBreathing')}
        style={[styles.button, styles.buttonBlue]}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};
export default MindfulChallenge;
