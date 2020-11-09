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
import {SOUND_OPTIONS} from '../../helpers/constants';

const Settings = ({type, goBack, sound}) => {
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
    console.log('duration _LLLL', duration);
    if (breathing.type === 'guided') {
      dispatch({type: 'SELECT_GUIDED_TIME', breathingTime: duration});
    } else {
      dispatch({type: 'SELECT_FIXED_TIME', breathingTime: duration});
    }
    analytics().logEvent('button_push', {title: `duration_${breathingTime}`});
  };

  const handleSoundSelect = (soundOption) => {
    dispatch({type: 'UPDATE_SOUND', ...soundOption});
  };

  const handleGoBack = () => {
    analytics().logEvent('button_push', {title: 'go back'});
    goBack();
  };

  const selectFadeoutTime = (duration) => {
    console.log('select ++++>', duration);
    dispatch({type: 'UPDATE_FADE_OUT', duration});
  };

  const fadoutDuration = sound.fadeOutDuration;
  console.log('fadeout duration', fadoutDuration);
  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>
          {type === 'duration' ? 'Duration' : 'Sound'}
        </Text>
      </View>
      <TouchableOpacity style={styles.backbuttonHolder} onPress={handleGoBack}>
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
          <FlatList
            data={SOUND_OPTIONS}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[styles.button]}
                key={item.fileName}
                onPress={() => handleSoundSelect(item)}>
                <Text
                  style={[
                    styles.text,
                    sound.id === item.id && styles.textBold,
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.timeHolder}>
            <TouchableOpacity
              style={styles.timeBtn}
              onPress={() => selectFadeoutTime(1000)}>
              <Text
                style={[
                  styles.timeText,
                  fadoutDuration === 1000 && styles.timeTextBold,
                ]}>
                1 s
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeBtn}
              onPress={() => selectFadeoutTime(1250)}>
              <Text
                style={[
                  styles.timeText,
                  fadoutDuration === 1250 && styles.timeTextBold,
                ]}>
                1.25 s
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeBtn}
              onPress={() => selectFadeoutTime(1500)}>
              <Text
                style={[
                  styles.timeText,
                  fadoutDuration === 1500 && styles.timeTextBold,
                ]}>
                1.5 s
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeBtn}
              onPress={() => selectFadeoutTime(1750)}>
              <Text
                style={[
                  styles.timeText,
                  fadoutDuration === 1750 && styles.timeTextBold,
                ]}>
                1.75 s
              </Text>
            </TouchableOpacity>
          </View>
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
    height: 350,
    width: 350,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  timeHolder: {
    height: 80,
    width: 450,
    // backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  timeBtn: {
    height: 40,
    width: 60,
    marginHorizontal: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: FontType.Medium,
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
  },
  timeTextBold: {
    fontFamily: FontType.ExtraBold,
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
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
    fontSize: 23,
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
