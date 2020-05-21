import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  View,
  ImageBackground,
  Animated,
  Image,
  TouchableOpacity,
  ScrollView,
  Text,
  Platform,
  SafeAreaView,
  PanResponder,
  StyleSheet,
  Modal,
} from 'react-native';
import BrethingGame from '../BreathingGame';
import analytics from '@react-native-firebase/analytics';
import {bookmarkSet, rejectSet} from '../../redux/actions/contents';
import styles from './Content.styles';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import {
  arrayToQueryParams,
  contentParser,
  uniq,
  filterSets,
  findNextSetIndex,
} from '../../helpers/common';
import bookmarkIcon from '../../../assets/icons/bookmark.png';
import downIcon from '../../../assets/icons/down.png';
import moreIcon from '../../../assets/icons/more.png';
import shareIcon from '../../../assets/icons/share.png';
import _ from 'lodash';
import {api} from '../../helpers/api';
const image_uri =
  'https://images.unsplash.com/photo-1589016079623-67f48aa74b9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollActive: true,
      scrollIndex: 0,
      modalVisible:
        props.activeIndex === null && props.contentType !== 'bookmarks',
    };

    this.categoryOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.iconOpacity = new Animated.Value(0);
    this.tapActive = true;
    this.swiperPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderRelease: (event, gestureState) => {
        const x = event.nativeEvent.locationX;
        const y = event.nativeEvent.pageY;
        const maxVerticalTapArea = ScreenHeight - ScreenHeight * 0.15;
        const halfScreenWidth = ScreenWidth / 2;
        const isSwipe = Math.abs(gestureState.dx) >= 1.3;
        if (isSwipe) {
          return;
        }
        if (x > halfScreenWidth) {
          console.log('next content');
          // right clickable area
          this.goToNextContent();
        } else if (x < halfScreenWidth && y < maxVerticalTapArea) {
          // left clickable area
          this.goToPreViousContent();
        }
      },
    });
  }

  goToPreViousContent = () => {
    const {allContents, activeIndex, contentType} = this.props;
    const hasPreviousContent = allContents[activeIndex];
    const isSetChange = this.checkSetChange();
    if (this.tapActive && !isSetChange && hasPreviousContent) {
      contentType === 'bookmarks'
        ? this.fadeOut({type: 'PREVIOUS_BOOKMARK_CONTENT'}, true)
        : this.fadeOut({type: 'PREVIOUS_CONTENT'}, true);
    }
  };

  goToNextContent = () => {
    const {allContents, activeIndex, contentType} = this.props;
    const hasNextContent = allContents[activeIndex + 1];
    if (this.tapActive && hasNextContent) {
      if (contentType === 'bookmarks') {
        this.fadeOut({type: 'NEXT_BOOKMARK_CONTENT'});
      } else {
        this.fadeOut({type: 'NEXT_CONTENT'});
      }
    }
  };

  checkSetChange = () => {
    // compares current set with previousset
    const {allContents, activeIndex} = this.props;
    const previousSet = _.get(allContents[activeIndex - 1], 'set');
    const currentSet = _.get(allContents[activeIndex], 'set');
    return previousSet !== currentSet;
  };

  checkSetChangeForward = () => {
    // compares current set with next set
    const {allContents, activeIndex} = this.props;
    const nextSet = _.get(allContents[activeIndex + 1], 'set');
    const currentSet = _.get(allContents[activeIndex], 'set');
    return nextSet !== currentSet;
  };

  turnOffInteraction = () => {
    this.tapActive = false;
    this.setState({scrollActive: false});
  };

  turnOnInteraction = () => {
    this.tapActive = true;
    this.setState({scrollActive: true});
  };

  fadeOutQucik = () => {
    const {dispatch, contentType} = this.props;
    this.categoryOpacity.setValue(0);
    this.contentOpacity.setValue(0);
    contentType === 'bookmarks'
      ? dispatch({type: 'GO_TO_NEXT_BOOKMARK_SET'})
      : dispatch({type: 'GO_TO_NEXT_SET'});
  };

  contentSeen = () => {
    this.turnOnInteraction();
    const {allContents, activeIndex} = this.props;
    const activeContent = allContents[activeIndex];
    const setId = _.get(activeContent, 'set');
    const contentId = _.get(activeContent, 'id');
    contentId &&
      analytics().logEvent('viewed_content', {
        content_id: contentId,
        set_id: setId,
      });
  };
  fadeIn = (isSetChanged) => {
    this.turnOffInteraction();
    if (isSetChanged) {
      Animated.timing(this.categoryOpacity, {
        toValue: 1,
        duration: 2500,
        delay: 800,
        useNativeDriver: true,
      }).start();
    }
    Animated.timing(this.contentOpacity, {
      toValue: 1,
      duration: 2000,
      delay: 1500,
      useNativeDriver: true,
    }).start(this.contentSeen);
  };

  markAsSeen = () => {
    const {activeIndex, allContents} = this.props;
    const activeSet = allContents[activeIndex].set;
    const url = `api/contents/${activeSet}/`;
    api
      .put(url)
      .then((resp) => {})
      .catch((error) => console.log('error', error));
  };

  bookmarkItem = () => this.props.dispatch(bookmarkSet());

  fadeOut = (actionType, ingnoreSetChange = false) => {
    const {dispatch, contentType} = this.props;
    this.turnOffInteraction();
    const willSetChange = this.checkSetChangeForward();
    if (contentType === 'regular' && willSetChange) {
      this.markAsSeen();
    }
    if (willSetChange && !ingnoreSetChange) {
      Animated.timing(this.categoryOpacity, {
        toValue: 0,
        duration: 2000,
        delay: 500,
        useNativeDriver: true,
      }).start();
    }
    Animated.timing(this.contentOpacity, {
      toValue: 0,
      duration: 1500,
      delay: 1500,
      useNativeDriver: true,
    }).start(() => {
      dispatch(actionType);
    });
  };

  resetContent = () => {
    this.categoryOpacity.setValue(0);
    this.contentOpacity.setValue(0);
    this.fadeIn(true);
  };

  fetchContent = (tags = null) => {
    const {categories, dispatch} = this.props;
    const selectedTagIds = tags ? tags : categories.selected;
    const selectedTags = selectedTagIds.map(
      (tagId) => categories.items.find((tag) => tag.id === tagId).name,
    );

    let url = '/api/contents/';
    const queryParams = arrayToQueryParams('tags', selectedTags);
    url = url + queryParams;
    api
      .get(url)
      .then((resp) => {
        const contents = contentParser(resp.data);
        dispatch({type: 'ADD_CONTENT', data: contents});
      })
      .catch((error) => console.log('error', error));
  };

  removeContents = (removedItems) => {
    const {allContents, activeIndex, dispatch} = this.props;
    const nextSetIndex = findNextSetIndex(activeIndex, allContents);
    const activeContents = allContents.slice(0, nextSetIndex);
    const upcomingContents = allContents.slice(nextSetIndex);
    const filteredContents = upcomingContents.filter(
      (item) => !removedItems.includes(item.tag),
    );
    const updatedContents = [...activeContents, ...filteredContents];
    dispatch({type: 'UPDATE_CONTENT', updatedContents});
  };

  fetchIfRequired = () => {
    const {allContents, categories} = this.props;
    const selectedTags = categories.selected;
    let contentTags = allContents.map((item) => item.tag);
    contentTags = uniq(contentTags);
    const isEqual = _.isEqual(contentTags.sort(), selectedTags.sort());
    if (isEqual) {
      // no change
      return;
    }
    if (selectedTags.length > contentTags.length) {
      // tag added, fetch the added tags.
      const addedTags = _.difference(selectedTags, contentTags);
      this.fetchContent(addedTags);
    } else {
      // tag removed, remove the contents of removed tags.
      const removedTags = _.difference(contentTags, selectedTags);
      this.removeContents(removedTags);
    }
  };

  componentDidMount() {
    const {dispatch, activeIndex, contentType, resetContent} = this.props;
    if (resetContent) {
      this.resetContent();
      return;
    }
    if (activeIndex !== null) {
      this.categoryOpacity.setValue(1);
      this.contentOpacity.setValue(1);
      contentType === 'regular' && this.fetchIfRequired();
      return;
    }
    // depending on the playing mode fetch data or play bookmark
    if (contentType === 'bookmarks') {
      // do nothing
      dispatch({type: 'START_BOOKMARKS'});
      return;
    }
    if (contentType === 'regular') {
      this.fetchContent();
    }
  }

  handleScrollEnd = (event) => {
    // this creates an illusion for the user for swiping
    // actually it just moves between two views.
    let index = event.nativeEvent.contentOffset.x / ScreenWidth;
    if (index === 1) {
      this.scrollRef.scrollTo({x: 0, y: 0, animated: false});
      this.props.dispatch(rejectSet());
      this.fadeOutQucik();
    }
  };

  showContent = (isSetChanged) => {
    const {contentType} = this.props;
    const {modalVisible} = this.state;
    //TODO: if set is change and contentType==='regular' then show breathing game.
    if (contentType === 'regular' && isSetChanged) {
      this.categoryOpacity.setValue(1);
      !modalVisible && this.setState({modalVisible: true});
      return;
    }
    this.fadeIn();
  };

  closeModal = () => {
    this.setState(
      {
        modalVisible: false,
      },
      this.fadeIn(true),
    );
  };

  minimizeBreathingGame = () => {
    this.setState({modalVisible: false});
    this.props.closeSheet();
  };

  componentDidUpdate(prevProps, prevState) {
    const {allContents, activeIndex} = this.props;
    const isSetChanged = this.checkSetChange();
    // index has changed
    if (prevProps.activeIndex !== activeIndex) {
      this.showContent(isSetChanged);
    }
    const previousContent = allContents[prevProps.activeIndex];
    const currentContent = allContents[activeIndex];
    if (
      currentContent &&
      previousContent &&
      previousContent.set !== currentContent.set
    ) {
      // upcoming and current sets.
      let activeSets = allContents.slice(activeIndex).map((item) => item.set);
      activeSets = filterSets(activeSets);
      // TODO: need to change that 3 to some other number.
      if (activeSets.length < 3) {
        this.fetchContent();
      }
    }
  }

  render() {
    const {allContents, activeIndex, contentType, backgroundImage} = this.props;
    const {modalVisible} = this.state;
    const activeContent = allContents[activeIndex];
    const isBookmarked = activeContent ? activeContent.isBookmark : false;
    const contentAvailable = allContents[activeIndex];
    const contentTag = contentAvailable ? allContents[activeIndex].tag : null;
    const contentText = contentAvailable ? allContents[activeIndex].text : null;
    const scrollEnabled =
      contentType === 'regular' && this.state.scrollActive && !isBookmarked;
    return (
      <ImageBackground style={styles.container} source={{uri: image_uri}}>
        <Animated.Text style={styles.category}>{contentTag}</Animated.Text>
        <SafeAreaView style={styles.contentContainer}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={this.props.closeSheet}>
              <Animated.Image source={downIcon} style={styles.iconDown} />
            </TouchableOpacity>
            <Animated.Image source={moreIcon} style={styles.iconMore} />
          </View>
          <ScrollView
            ref={(ref) => (this.scrollRef = ref)}
            onMomentumScrollEnd={this.handleScrollEnd}
            horizontal
            scrollEnabled={scrollEnabled}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            scrollEventThrottle={16}
            {...this.swiperPanResponder.panHandlers}>
            <TouchableOpacity activeOpacity={0.7} style={styles.slideContainer}>
              <View key={0} style={{width: ScreenWidth}}>
                <View style={styles.categoryContainer} />
                <View
                  style={styles.thoughtContainer}
                  {...this.swiperPanResponder.panHandlers}>
                  <Animated.Text
                    style={[styles.content, {opacity: this.contentOpacity}]}>
                    {contentText}
                  </Animated.Text>
                </View>
              </View>
              <View key={1} style={{width: ScreenWidth}} />
            </TouchableOpacity>
          </ScrollView>
          <View
            style={styles.footerContainer}
            {...this.swiperPanResponder.panHandlers}>
            <Animated.Image source={shareIcon} style={styles.icon} />
            <TouchableOpacity onPress={this.bookmarkItem}>
              <Animated.Image
                source={bookmarkIcon}
                style={[
                  styles.bookmarkIcon,
                  isBookmarked && styles.bookmarkColor,
                ]}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        {modalVisible && Platform.OS === 'android' ? (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
            }}>
            <BrethingGame
              closeModal={this.closeModal}
              contentTag={contentTag}
              minimize={this.minimizeBreathingGame}
            />
          </View>
        ) : (
          <Modal transparent={true} animationType="fade" visible={modalVisible}>
            <BrethingGame
              closeModal={this.closeModal}
              contentTag={contentTag}
              minimize={this.minimizeBreathingGame}
            />
          </Modal>
        )}
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {contents, categories, contentType, bookmarks, loginInfo} = state;
  const allContents =
    contentType === 'bookmarks' ? bookmarks.contents : contents.allContents;
  const activeIndex =
    contentType === 'bookmarks' ? bookmarks.activeIndex : contents.activeIndex;
  return {
    allContents,
    activeIndex,
    categories,
    contentType,
    loginInfo,
  };
};

export default connect(mapStateToProps)(Content);
