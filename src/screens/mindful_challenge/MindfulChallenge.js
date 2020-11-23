import React from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import styles from './MindfulChallenge.styles';
import analytics from '@react-native-firebase/analytics';

const MindfulChallenge = ({navigation}) => {
  const breathing = useSelector((state) => state.breathing);
  const userInfo = useSelector((state) => state.userInfo);
  const streakCount = userInfo.mindfulChallengeStreak;
  const goBack = () => navigation.goBack();
  const handleStart = () => {
    analytics().logEvent('button_push', {title: 'start_mindful_challenge'});
    if (userInfo.showExerciseExplainer) {
      navigation.navigate('ExerciseExplainer');
    } else {
      navigation.navigate('GuidedBreathing');
    }
  };
  const buttonTitle = streakCount > 0 ? 'CONTINUE' : 'START';
  return (
    <ImageBackground source={breathing.image} style={styles.background}>
      <View style={styles.titleBox}>
        <Text style={styles.titleSm}>{breathing.name_line_one}</Text>
        <Text style={styles.title}>{breathing.name_line_two}</Text>
      </View>

      <View style={styles.descriptionBox}>
        <Text style={styles.descriptionText}>{breathing.description}</Text>
      </View>
      <Text style={styles.streak}>
        {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
      </Text>
      <TouchableOpacity style={styles.backbuttonHolder} onPress={goBack}>
        <Image
          source={require('../../../assets/icons/arrow_left.png')}
          style={styles.backbutton}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleStart}
        style={[styles.button, styles.buttonBlue]}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>{buttonTitle}</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};
export default MindfulChallenge;
