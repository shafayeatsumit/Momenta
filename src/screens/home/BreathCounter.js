import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import styles from './Home.styles';
import PlusIcon from '../../../assets/icons/plus.png';
import MinusIcon from '../../../assets/icons/minus.png';

const BreathCounter = (props) => {
  const dispatch = useDispatch();
  const breathingType = useSelector((state) => state.breathing.type);
  const guidedBreathCount = useSelector(
    (state) => state.guidedBreathing.numberOfBreaths,
  );
  const fixedBreathCount = useSelector(
    (state) => state.fixedBreathing.numberOfBreaths,
  );
  const breathCount =
    breathingType === 'guided' ? guidedBreathCount : fixedBreathCount;
  const addBreathCount = () =>
    breathingType === 'fixed'
      ? dispatch({type: 'ADD_FIXED_BREATH'})
      : dispatch({type: 'ADD_GUIDED_BREATH'});

  const removeBreathCount = () =>
    breathingType === 'guided'
      ? dispatch({type: 'REMOVE_GUIDED_BREATH'})
      : dispatch({type: 'REMOVE_FIXED_BREATH'});

  const minutes = breathCount > 1 ? 'Minutes' : 'Minute';
  return (
    <View style={styles.breathCounterContainer}>
      <TouchableOpacity onPress={removeBreathCount}>
        <Image source={MinusIcon} style={styles.minusIcon} />
      </TouchableOpacity>
      <Text style={styles.breathCount}>
        {breathCount} {minutes}
      </Text>
      <TouchableOpacity onPress={addBreathCount}>
        <Image source={PlusIcon} style={styles.plusIcon} />
      </TouchableOpacity>
    </View>
  );
};
export default BreathCounter;
