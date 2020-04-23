import React from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import closeIcon from '../../../assets/icons/close.png';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import {colors, FontType} from '../../helpers/theme';
import {RFValue} from '../../helpers/responsiveFont';

const MinimizedView = ({maximize}) => {
  const contentType = useSelector((state) => state.contentType);
  const dispatch = useDispatch();
  const handleClose = () => {
    if (contentType === 'bookmarks') {
      dispatch({type: 'RESET_BOOKMARKS'});
    }
    // depending on contentType ==> dispatch action
  };
  return (
    <View style={styles.miminizedView}>
      <TouchableOpacity
        style={styles.minimizedContentHolder}
        onPress={maximize}>
        <Text style={styles.minimizeCategory}>Bookmarks</Text>
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
    height: ScreenHeight * 0.08,
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
  closeIcon: {
    height: ICON_SIZE,
    width: ICON_SIZE,
    tintColor: 'white',
  },
});
