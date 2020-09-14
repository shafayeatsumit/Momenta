import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
} from 'react-native';
import {FontType, Colors} from '../../helpers/theme';
import {
  BREATHING_TYPES,
  BREATHING_TIME,
  CUSTOM_CONFIG,
} from '../../helpers/breathing_constants';
import {useSelector, useDispatch} from 'react-redux';

const Options = ({type, handlePress, customConfigId}) => {
  const {id: breathingId, breathingTime} = useSelector(
    (state) => state.breathing,
  );
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

  const getCustomTime = () => {
    const timeObj = CUSTOM_CONFIG[customConfigId];
    const {min, max, interval} = timeObj;
    // Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

    const timeList = Array.from(
      {length: (max - min) / interval + 1},
      (_, i) => min + i * interval,
    );

    return timeList;
  };

  const getOptions = () =>
    type === 'custom_interval' ? getCustomTime() : getBreathingTime();

  const ListOfOptions =
    type === 'breathing_type' ? BREATHING_TYPES : getOptions();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} indicatorStyle={'white'}>
        {ListOfOptions.map((item) => (
          <TouchableOpacity
            key={item.id || item}
            onPress={() => handlePress(item)}>
            <Text
              style={[
                styles.text,
                (item.id === breathingId || item === breathingTime) && {
                  color: Colors.cornflowerBlue,
                },
              ]}>
              {item.name || item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
export default Options;

const styles = StyleSheet.create({
  container: {
    height: 210,
    width: 270,
    marginBottom: 15,
  },
  scrollView: {
    flex: 1,
    // backgroundColor: 'red',
    borderRadius: 20,
    backgroundColor: Colors.betterBlueLight,
  },
  text: {
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
    paddingLeft: 22,
    paddingVertical: 7,
  },
});
