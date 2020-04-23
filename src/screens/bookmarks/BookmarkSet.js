import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import styles from './Bookmarks.styles';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import MorphView from '../../components/MorphView';
import DragAndDrop from '../../../assets/icons/drag_and_drop.png';
import BookMarkIcon from '../../../assets/icons/bookmark_filled.png';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';

const BookmarkSet = ({item, index, drag, isActive}) => {
  const bookmarks = useSelector((state) => state.bookmarks).bookmarks;
  const minimized = useSelector((state) => state.minimized);
  const dispatch = useDispatch();
  const groupBookmarksBySet = _.groupBy(bookmarks, (content) => content.setId);
  const setItems = groupBookmarksBySet[item];
  const deleteBookmark = (setId) => {
    dispatch({type: 'DELTE_BOOKMARK', setId});
  };
  return (
    <TouchableOpacity
      style={styles.item}
      onLongPress={drag}
      activeOpacity={0.6}>
      {minimized && (
        <View style={styles.progressConatiner}>
          <AnimatedCircularProgress
            size={20}
            width={0.5}
            prefill={100}
            fill={100}
            tintColor="rgb(60,113,222)"
          />
        </View>
      )}

      <MorphView>
        <View
          style={[styles.morphView, minimized && {width: ScreenWidth - 75}]}>
          <View style={styles.contentTopRow}>
            <Image source={DragAndDrop} style={styles.dragIcon} />
            <Text style={styles.setCategory}>{setItems[0].category}</Text>
            {!minimized && (
              <TouchableOpacity
                style={styles.bookmarkHolder}
                onPress={() => deleteBookmark(item)}>
                <Image source={BookMarkIcon} style={styles.bookmarkIcon} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.contentBottomRow}>
            <Text style={styles.setContent}>{setItems[0].content}</Text>
          </View>
        </View>
      </MorphView>
    </TouchableOpacity>
  );
};

export default BookmarkSet;
