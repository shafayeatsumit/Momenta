import React from 'react';
import {View, Text, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import styles from './Home.styles';
import PlusIcon from '../../../assets/icons/plus.png';
import MinusIcon from '../../../assets/icons/minus.png';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {add} from 'react-native-reanimated';

const FixedBreathing = (props) => {
  const dispatch = useDispatch();
  const fixedBreathing = useSelector((state) => state.fixedBreathing);
  const {inhale, inhaleHold, exhale, exhaleHold} = fixedBreathing;
  const addValue = (type) => {
    switch (!!type) {
      case type === 'inhale':
        dispatch({type: 'ADD_FIXED_INHALE'});
        break;
      case type === 'exhale':
        dispatch({type: 'ADD_FIXED_EXHALE'});
        break;
      case type === 'exhale_hold':
        dispatch({type: 'ADD_FIXED_EXHALE_HOLD'});
        break;
      case type === 'inhale_hold':
        dispatch({type: 'ADD_FIXED_INHALE_HOLD'});
        break;
    }
  };
  const removeValue = (type) => {
    switch (!!type) {
      case type === 'inhale':
        dispatch({type: 'REMOVE_FIXED_INHALE'});
        break;
      case type === 'exhale':
        dispatch({type: 'REMOVE_FIXED_EXHALE'});
        break;
      case type === 'exhale_hold':
        dispatch({type: 'REMOVE_FIXED_EXHALE_HOLD'});
        break;
      case type === 'inhale_hold':
        dispatch({type: 'REMOVE_FIXED_INHALE_HOLD'});
        break;
    }
  };

  return (
    <View style={styles.checkMarkHolder}>
      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={() => removeValue('inhale')}>
          <Image source={MinusIcon} style={styles.minusIconSm} />
        </TouchableOpacity>
        <Text style={styles.settingsText}>{inhale}s Inhale</Text>
        <TouchableOpacity onPress={() => addValue('inhale')}>
          <Image source={PlusIcon} style={styles.plusIconSm} />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={() => removeValue('inhale_hold')}>
          <Image source={MinusIcon} style={styles.minusIconSm} />
        </TouchableOpacity>
        <Text style={styles.settingsText}>{inhaleHold}s Hold</Text>
        <TouchableOpacity onPress={() => addValue('inhale_hold')}>
          <Image source={PlusIcon} style={styles.plusIconSm} />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={() => removeValue('exhale')}>
          <Image source={MinusIcon} style={styles.minusIconSm} />
        </TouchableOpacity>
        <Text style={styles.settingsText}>{exhale}s Exhale</Text>
        <TouchableOpacity onPress={() => addValue('exhale')}>
          <Image source={PlusIcon} style={styles.plusIconSm} />
        </TouchableOpacity>
      </View>
      <View style={styles.settingsContainer}>
        <TouchableOpacity onPress={() => removeValue('exhale_hold')}>
          <Image source={MinusIcon} style={styles.minusIconSm} />
        </TouchableOpacity>
        <Text style={styles.settingsText}>{exhaleHold}s Hold</Text>
        <TouchableOpacity onPress={() => addValue('exhale_hold')}>
          <Image source={PlusIcon} style={styles.plusIconSm} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default FixedBreathing;
