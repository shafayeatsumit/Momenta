import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import ProgressBar from './ProgressBar';
import styles from './Bookmarks.styles';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import MorphView from '../../components/MorphView';
import DragAndDrop from '../../../assets/icons/drag_and_drop.png';
import BookMarkIcon from '../../../assets/icons/bookmark_filled.png';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
import {deleteBookmark} from '../../redux/actions/bookmarks';

const BookmarkSet = ({
  setId,
  index,
  drag,
  isActive,
  handleSetPress,
  handleSetPressShuffleOn,
}) => {
  const bookmarksState = useSelector((state) => state.bookmarks);
  const {bookmarks, shuffle} = bookmarksState;
  const minimized = useSelector((state) => state.minimized);
  const contentType = useSelector((state) => state.contentType);
  const dispatch = useDispatch();
  const groupBookmarksBySet = _.groupBy(bookmarks, (content) => content.setId);
  const setItems = groupBookmarksBySet[setId];
  const handleBookmarkPress = () => dispatch(deleteBookmark(setId, setItems));
  const handleSetSelect = () => handleSetPress(setId);
  const handleSetSelectShuffleOn = () => handleSetPressShuffleOn(setId);
  const showProgressTracker = contentType === 'bookmarks' && minimized;
  const hideBookmarkIcon = contentType === 'bookmarks' && minimized;
  return (
    <TouchableOpacity
      style={styles.item}
      onLongPress={drag}
      onPress={shuffle ? handleSetSelectShuffleOn : handleSetSelect}
      activeOpacity={0.6}>
      {showProgressTracker && (
        <ProgressBar bookmarks={bookmarks} currentSetId={setId} />
      )}

      <MorphView>
        <View
          style={[styles.morphView, minimized && {width: ScreenWidth - 75}]}>
          <View style={styles.contentTopRow}>
            <Image source={DragAndDrop} style={styles.dragIcon} />
            <Text style={styles.setCategory}>{setItems[0].tag}</Text>
            {hideBookmarkIcon ? null : (
              <TouchableOpacity
                style={styles.bookmarkHolder}
                onPress={handleBookmarkPress}>
                <Image source={BookMarkIcon} style={styles.bookmarkIcon} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.contentBottomRow}>
            <Text style={styles.setContent}>{setItems[0].text}</Text>
          </View>
        </View>
      </MorphView>
    </TouchableOpacity>
  );
};

export default BookmarkSet;
