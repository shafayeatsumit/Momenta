import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import closeIcon from '../../../assets/icons/close.png';
import {ScreenWidth} from '../../helpers/constants/common';
import {colors, FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';
import {getCategory, getProgress, getBookmark} from '../../helpers/common';
import analytics from '@react-native-firebase/analytics';

const MinimizedView = ({maximize}) => {
  const contents = useSelector((state) => state.contents);
  const dispatch = useDispatch();
  const handleClose = () => {
    analytics().logEvent('cancel');
    dispatch({type: 'RESET_TAGS_CONTENT'});
  };

  const {activeIndex, allContents} = contents;
  const tagName = getCategory(activeIndex, allContents);
  const progress = getProgress(activeIndex, allContents);
  const isBookmark = getBookmark(activeIndex, allContents);

  return (
    <View style={styles.miminizedView}>
      <TouchableOpacity
        style={styles.minimizedContentHolder}
        onPress={maximize}>
        {isBookmark ? (
          <Text style={styles.minimizeCategory}>Bookmarks</Text>
        ) : (
          <>
            <Text style={styles.minimizeCategory}>{tagName}</Text>
            {progress && (
              <Text style={styles.minimizeProgress}>
                {progress.currentIndex}/{progress.totalInTheSet}
              </Text>
            )}
          </>
        )}
      </TouchableOpacity>
      <View style={styles.minimizedIconHolder}>
        <TouchableOpacity onPress={handleClose}>
          <Image source={closeIcon} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default MinimizedView;

const ICON_SIZE = RFValue(30);
const styles = StyleSheet.create({
  miminizedView: {
    width: ScreenWidth,
    height: 100,
    backgroundColor: colors.primaryLight,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  minimizedContentHolder: {
    flex: 3,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  minimizedIconHolder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimizeCategory: {
    fontFamily: FontType.SemiBold,
    fontSize: RFValue(20),
    color: '#ffffff',
  },
  minimizeProgress: {
    fontFamily: FontType.SemiBold,
    fontSize: RFValue(18),
    color: '#7d7e8d',
    paddingLeft: 10,
  },
  closeIcon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    tintColor: 'white',
  },
});
