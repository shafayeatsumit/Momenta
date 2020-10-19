import React, {useEffect} from 'react';
import {ScrollView, BackHandler} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import Thumbnail from './Thumbnail';
import styles from './Home.styles';
import {BREATHING_TYPES} from '../../helpers/breathing_constants';
import {useDispatch} from 'react-redux';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const handleBreathTypeSelect = (breathing) => {
    const breathingType = breathing.type;
    if (breathingType === 'guided') {
      dispatch({type: 'SELECT_GUIDED_TYPE', data: breathing});
    } else {
      dispatch({type: 'SELECT_FIXED_TYPE', data: breathing});
    }
    navigation.navigate('BreathingType', {breathingType: breathing});
    analytics().logEvent('button_push', {title: `${breathing.id}`});
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

    return () => backHandler.remove();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.tilesContainer}>
      {BREATHING_TYPES.map((type) => (
        <Thumbnail
          key={type.id}
          breathingType={type}
          handleBreathTypeSelect={handleBreathTypeSelect}
        />
      ))}
    </ScrollView>
  );
};

export default Home;
