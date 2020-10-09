import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {FontType, Colors} from '../../helpers/theme';
import {BREATHING_TIME} from '../../helpers/breathing_constants';
import BackButton from '../../../assets/icons/arrow_left.png';
import {useSelector, useDispatch} from 'react-redux';
import analytics from '@react-native-firebase/analytics';

const Settings = ({type, sound, goBack, handleSoundSelect}) => {
  const breathing = useSelector((state) => state.breathing);
  const dispatch = useDispatch();
  const {id: breathingId, breathingTime} = breathing;
  const getBreathingTime = () => {
    const timeObj = BREATHING_TIME[breathingId];
    const {min, max, interval} = timeObj;
    // Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
    const timeList = Array.from(
      {length: (max - min) / interval + 1},
      (_, i) => min + i * interval,
    );

    return timeList;
  };

  const handleTimeSelect = (duration) => {
    if (breathing.type === 'guided') {
      dispatch({type: 'SELECT_GUIDED_TIME', breathingTime: duration});
    } else {
      dispatch({type: 'SELECT_FIXED_TIME', breathingTime: duration});
    }
    analytics().logEvent('button_push', {title: `duration_${breathingTime}`});
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>
          {type === 'duration' ? 'Duration' : 'Sound'}
        </Text>
      </View>
      <TouchableOpacity style={styles.backbuttonHolder} onPress={goBack}>
        <Image source={BackButton} style={styles.backbutton} />
      </TouchableOpacity>
      {type === 'duration' ? (
        <View style={styles.scrollableBox}>
          <FlatList
            data={getBreathingTime()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleTimeSelect(item)}>
                <Text
                  style={[
                    styles.text,
                    breathingTime === item && styles.textBold,
                  ]}>
                  {item} m
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(i) => i.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.box}>
          <TouchableOpacity onPress={handleSoundSelect}>
            <Text style={[styles.text, sound === 'On' && styles.textBold]}>
              On
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSoundSelect}>
            <Text style={[styles.text, sound === 'Off' && styles.textBold]}>
              Off
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBox: {
    position: 'absolute',
    top: 20,
    height: 30,
    width: 200,
    alignSelf: 'center',

    alignItems: 'center',
  },
  title: {
    fontFamily: FontType.Medium,
    fontSize: 22,
    textAlign: 'center',
    color: 'white',
  },

  box: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollableBox: {
    height: 250,
    width: 100,
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
  text: {
    color: '#cdcdcd',
    fontFamily: FontType.Regular,
    fontSize: 20,
    paddingVertical: 7,
  },
  textBold: {
    fontFamily: FontType.ExtraBold,
    color: 'white',
    fontSize: 22,
  },
  backbuttonHolder: {
    position: 'absolute',
    top: 20,
    left: 20,
    height: 45,
    width: 45,
  },
  backbutton: {
    height: 20,
    width: 20,
    tintColor: 'white',
  },
});
