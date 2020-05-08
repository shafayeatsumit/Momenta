import React from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import closeIcon from '../../../assets/icons/close.png';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {colors, FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';
import {getCategory, getProgress} from '../../helpers/common';
import analytics from '@react-native-firebase/analytics';

const MinimizedView = ({maximize}) => {
  let progress, categoryName;
  const contentType = useSelector((state) => state.contentType);
  const contents = useSelector((state) => state.contents);
  const dispatch = useDispatch();
  const handleClose = () => {
    analytics().logEvent('cancel');
    if (contentType === 'bookmarks') {
      dispatch({type: 'RESET_BOOKMARKS'});
    } else {
      dispatch({type: 'RESET_CATEGORIES_CONTENT'});
    }
  };
  if (contentType === 'regular') {
    const {activeIndex, allContents} = contents;
    categoryName = getCategory(activeIndex, allContents);
    progress = getProgress(activeIndex, allContents);
  }
  return (
    <View style={styles.miminizedView}>
      <TouchableOpacity
        style={styles.minimizedContentHolder}
        onPress={maximize}>
        {contentType === 'bookmarks' ? (
          <Text style={styles.minimizeCategory}>Bookmarks</Text>
        ) : (
          <>
            <Text style={styles.minimizeCategory}>{categoryName}</Text>
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
    height: ScreenHeight * 0.09,
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 0.3,
    borderBottomColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
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
