import React, {Component} from 'react';
import {View, TouchableOpacity, Text, SafeAreaView, Image} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {connect} from 'react-redux';
import Content from '../content/Content';
import RBSheet from '../../components/rbsheet';
import {RFValue} from '../../helpers/responsiveFont';
import StartOptions from './StartOptions';
import _ from 'lodash';
import MinimizedView from '../../components/minimizedView/MinimizedView';
import styles from './Bookmarks.styles';
import {rbSheetStyle, rbSheetProps} from '../../helpers/constants/rbsheet';
import BookmarkSet from './BookmarkSet';

class Bookmarks extends Component {
  constructor(props) {
    super(props);
    this.groupBookmarksBySet = {};
    this.statrtFromSpecificBookmarkSet = false;
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({type: 'FETCH_BOOKMARKS'});
  }

  handleShuffle = () => {
    const {shuffle, dispatch} = this.props;
    shuffle
      ? dispatch({type: 'BOOKMARK_SHUFFLE_OFF'})
      : dispatch({type: 'BOOKMARK_SHUFFLE_ON'});
  };

  handleClose = () => this.props.dispatch({type: 'SET_MINIMIZE_TRUE'});

  rbsheetClose = () => {
    // close rbsheet on button press
    this.RBSheet.close();
    this.statrtFromSpecificBookmarkSet = false;
  };

  handleStart = () => {
    this.props.dispatch({type: 'SET_CONTENT_TYPE', contentType: 'bookmarks'});
    this.RBSheet.open();
  };

  rbSheetOpen = () => {
    this.RBSheet.open();
  };

  getSetIdOfActiveCotent = () => {
    const {activeIndex, contents} = this.props;
    const activeContent = contents[activeIndex];
    const activeSet = activeContent ? activeContent.setId : null;
    return activeSet;
  };

  getActiveContentIndex = (updatedBookmarks) => {
    // finds out the current active content position
    // after draging and changing the position;
    const {activeIndex, contents} = this.props;
    const activeContent = contents[activeIndex];
    return updatedBookmarks.findIndex((item) => item.id === activeContent.id);
  };

  getActivesetPosition = (activeSetId, previousSetIds, currentSetIds) => {
    const prevPositionIndex = previousSetIds.indexOf(activeSetId);
    const currentPositionIndex = currentSetIds.indexOf(activeSetId);
    if (currentPositionIndex > prevPositionIndex) {
      return 'DRAGGED_DOWN';
    } else {
      return 'DRAGGED_UP';
    }
  };

  sortBookmarks = (newOrderOfSetIds) => {
    const {bookmarks} = this.props;
    const updatedBookmarks = _.sortBy(bookmarks.slice(), (item) =>
      newOrderOfSetIds.indexOf(item.setId),
    );
    return updatedBookmarks;
  };

  handleSetPress = (setId) => {
    this.statrtFromSpecificBookmarkSet = true;
    const {dispatch} = this.props;
    dispatch({type: 'START_FROM_SPECIFIC_BOOKMARK_SET', selectedSetId: setId});
    this.rbSheetOpen();
  };

  handleDrag = ({data}) => {
    const {shuffle, dispatch} = this.props;
    if (shuffle) {
      return;
    }
    const bookmarkSetIds = Object.keys(this.groupBookmarksBySet);
    const noChangedInOrder = _.isEqual(bookmarkSetIds, data);
    if (noChangedInOrder) {
      return;
    }

    const activeSet = this.getSetIdOfActiveCotent();
    const newSortedBookmarks = this.sortBookmarks(data);
    if (activeSet) {
      const dragPosition = this.getActivesetPosition(
        activeSet,
        bookmarkSetIds,
        data,
      );
      const updatedActiveIndex = this.getActiveContentIndex(newSortedBookmarks);
      if (dragPosition === 'DRAGGED_UP') {
        dispatch({
          type: 'ACTIVE_SET_MOVED_UP',
          updatedActiveIndex,
          bookmarks: newSortedBookmarks,
        });
      } else {
        dispatch({
          type: 'ACTIVE_SET_MOVED_DOWN',
          updatedActiveIndex,
          bookmarks: newSortedBookmarks,
        });
      }
    } else {
      dispatch({type: 'UPDATE_BOOKMARK_ORDER', bookmarks: newSortedBookmarks});
    }
  };

  render() {
    const {bookmarks, shuffle, minimized} = this.props;
    this.groupBookmarksBySet = _.groupBy(bookmarks, (item) => item.setId);
    const bookmarkSets = Object.keys(this.groupBookmarksBySet);
    return (
      <SafeAreaView style={styles.safeArea}>
        <DraggableFlatList
          data={bookmarkSets}
          renderItem={({item, index, drag, isActive}) => (
            <BookmarkSet
              setId={item}
              index={index}
              drag={drag}
              isActive={isActive}
              minimized={minimized}
              bookmarkItems={this.groupBookmarksBySet}
              handleSetPress={this.handleSetPress}
            />
          )}
          keyExtractor={(item, index) => `draggable-item-${item}`}
          onDragEnd={({data}) => this.handleDrag({data})}
          contentContainerStyle={{marginTop: 20}}
        />

        <RBSheet
          ref={(ref) => {
            this.RBSheet = ref;
          }}
          onClose={this.handleClose}
          {...rbSheetProps}
          customStyles={rbSheetStyle}>
          <Content
            closeSheet={this.rbsheetClose}
            resetContent={this.statrtFromSpecificBookmarkSet}
          />
        </RBSheet>
        {this.props.minimized ? (
          <MinimizedView maximize={this.rbSheetOpen} />
        ) : (
          <StartOptions
            handleStart={this.handleStart}
            handleShuffle={this.handleShuffle}
            shuffle={shuffle}
          />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {bookmarks, contentType, minimized} = state;
  return {
    bookmarks: bookmarks.bookmarks,
    activeIndex: bookmarks.activeIndex,
    contents: bookmarks.contents,
    shuffle: bookmarks.shuffle,
    minimized,
    contentType,
  };
};
export default connect(mapStateToProps)(Bookmarks);
