import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, StyleSheet} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import styles from './Bookmarks.styles';
import {RFValue} from '../../helpers/responsiveFont';
import {useSelector} from 'react-redux';

const ProgressBar = ({currentSetId}) => {
  const bookmarks = useSelector((state) => state.bookmarks).contents;
  const setContent = bookmarks.filter((item) => item.setId === currentSetId);
  const seenContent = setContent.filter((item) => item.isSeen);
  const progress = (seenContent.length / setContent.length) * 100;
  const progressSize = RFValue(20);
  const fillWidth = process === 100 ? RFValue(20) / 2 : 1;
  return (
    <View style={styles.progressConatiner}>
      {progress === 0 ? (
        <AnimatedCircularProgress
          size={RFValue(20)}
          width={RFValue(20) / 2}
          prefill={100}
          fill={100}
          rotation={360}
          tintColor="#232741"
        />
      ) : (
        <AnimatedCircularProgress
          size={progressSize}
          width={fillWidth}
          prefill={progress}
          fill={progress}
          rotation={360}
          tintColor="rgb(60,113,222)"
        />
      )}
    </View>
  );
};
export default ProgressBar;
