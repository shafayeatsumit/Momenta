import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import styles from './Home.styles';
import {GUIDED_BREATHINGS} from '../../helpers/constants';
import CheckMark from '../../../assets/icons/check.png';
import {useSelector, useDispatch} from 'react-redux';

const GuidedBreathingTypes = (props) => {
  const dispatch = useDispatch();
  const breathingType = useSelector((state) => state.guidedBreathing.id);

  return (
    <View style={styles.checkMarkHolder}>
      {GUIDED_BREATHINGS.map((item) => {
        return (
          <TouchableOpacity
            onPress={() =>
              dispatch({
                type: 'SWITCH_GUIDED_BREATHING_TYPE',
                breathingType: item.id,
              })
            }>
            <View key={item.name} style={styles.checkMark}>
              <View>
                {breathingType === item.id ? (
                  <Image source={CheckMark} style={styles.icon} />
                ) : (
                  <View style={styles.unchecked} />
                )}
              </View>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default GuidedBreathingTypes;
