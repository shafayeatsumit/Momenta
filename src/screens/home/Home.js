import React, {useEffect} from 'react';
import {ScrollView, BackHandler, StatusBar} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import Thumbnail from './Thumbnail';
import styles from './Home.styles';
import {
  BREATHING_TYPES,
  MindfulChallenge,
  CalmerBreathingLessons,
} from '../../helpers/breathing_constants';
import {useDispatch, useSelector} from 'react-redux';
import IdleTimerManager from 'react-native-idle-timer';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const mindfulChallengeStreak = userInfo.mindfulChallengeStreak;
  const handleBreathTypeSelect = (breathing) => {
    const breathingType = breathing.type;
    analytics().logEvent('button_push', {title: `${breathing.id}`});
    if (breathingType === 'guided') {
      dispatch({type: 'SELECT_GUIDED_TYPE', data: breathing});
    } else {
      dispatch({type: 'SELECT_FIXED_TYPE', data: breathing});
    }

    if (userInfo.showExerciseExplainer) {
      navigation.navigate('ExerciseExplainer');
    } else {
      breathing.type === 'fixed'
        ? navigation.navigate('FixedBreathing')
        : navigation.navigate('GuidedBreathing');
    }
  };

  const handlePressMindfulChallenge = () => {
    analytics().logEvent('button_push', {title: MindfulChallenge.id});
    dispatch({type: 'SELECT_GUIDED_TYPE', data: MindfulChallenge});
    navigation.navigate('MindfulChallenge');
  };

  const handlePressCalmerBreathingLessons = () => {
    analytics().logEvent('button_push', {title: CalmerBreathingLessons.id});
    dispatch({type: 'SELECT_GUIDED_TYPE', data: CalmerBreathingLessons});
    navigation.navigate('CalmerBreathingLessons');
  };

  useEffect(() => {
    const backAction = () => {
      analytics().logEvent('button_push', {title: 'android_back_button'});
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    IdleTimerManager.setIdleTimerDisabled(true);
    return () => {
      IdleTimerManager.setIdleTimerDisabled(false);
      backHandler.remove();
    };
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.tilesContainer}>
      <StatusBar hidden />
      {BREATHING_TYPES.map((type) => (
        <Thumbnail
          key={type.id}
          breathingType={type}
          handleBreathTypeSelect={handleBreathTypeSelect}
        />
      ))}
      <Thumbnail
        key={MindfulChallenge.id}
        breathingType={MindfulChallenge}
        handleBreathTypeSelect={handlePressMindfulChallenge}
        textStyle={{fontSize: 15}}
        footerText={`${mindfulChallengeStreak} day streak`}
      />
      <Thumbnail
        key={CalmerBreathingLessons.id}
        breathingType={CalmerBreathingLessons}
        handleBreathTypeSelect={handlePressCalmerBreathingLessons}
        middleText="10 day course"
      />
    </ScrollView>
  );
};

export default Home;
