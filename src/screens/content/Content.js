import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  ImageBackground,
  Animated,
  Image,
  TouchableOpacity,
  ScrollView,
  AppState,
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
import _ from 'lodash';
import {api} from '../../helpers/api';
const image_uri =
  'https://images.unsplash.com/photo-1589016079623-67f48aa74b9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollActive: true,
      appState: AppState.currentState,
      scrollIndex: 0,
      breathingGameVisible:
        props.activeIndex === null || props.showBreathingGame,
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
    const {allContents, activeIndex} = this.props;
    const hasPreviousContent = allContents[activeIndex];
    const isSetChange = this.checkSetChange();
    if (this.tapActive && !isSetChange && hasPreviousContent) {
      this.fadeOut({type: 'PREVIOUS_CONTENT'}, true);
    }
  };

  goToNextContent = () => {
    const {allContents, activeIndex} = this.props;
    const hasNextContent = allContents[activeIndex + 1];
    if (this.tapActive && hasNextContent) {
      this.fadeOut({type: 'NEXT_CONTENT'});
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

  goToNextSet = () => {
    const {dispatch} = this.props;
    this.categoryOpacity.setValue(0);
    this.contentOpacity.setValue(0);
    dispatch({type: 'GO_TO_NEXT_SET'});
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
      duration: 1000,
      delay: 0,
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

  handleBookmark = () => this.props.dispatch(bookmarkSet());

  fadeOut = (actionType, ingnoreSetChange = false) => {
    const {dispatch} = this.props;
    this.turnOffInteraction();
    const willSetChange = this.checkSetChangeForward();
    if (willSetChange) {
      this.markAsSeen();
    }
    if (willSetChange && !ingnoreSetChange) {
      Animated.timing(this.categoryOpacity, {
        toValue: 0,
        duration: 1000,
        delay: 200,
        useNativeDriver: true,
      }).start();
    }
    Animated.timing(this.contentOpacity, {
      toValue: 0,
      duration: 1000,
      delay: 500,
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
      .catch((error) => console.log(`error in ${url}`, error));
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

  handleAppStateChange = (nextAppState) => {
    const {breathingGameVisible} = this.state;
    if (!breathingGameVisible && nextAppState === 'background') {
      this.setState({breathingGameVisible: true});
      this.goToNextSet();
    }
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    const {activeIndex, showBreathingGame} = this.props;

    if (activeIndex !== null && showBreathingGame) {
      this.categoryOpacity.setValue(1);
      return;
    }

    if (activeIndex !== null && !showBreathingGame) {
      this.categoryOpacity.setValue(1);
      this.contentOpacity.setValue(1);
      this.fetchIfRequired();
      return;
    }

    this.fetchContent();
  }

  handleScrollEnd = (event) => {
    // this creates an illusion for the user for swiping
    // actually it just moves between two views.
    let index = event.nativeEvent.contentOffset.x / ScreenWidth;
    if (index === 1) {
      this.scrollRef.scrollTo({x: 0, y: 0, animated: false});
      this.props.dispatch(rejectSet());
      this.goToNextSet();
    }
  };

  showContent = (isSetChanged) => {
    const {breathingGameVisible} = this.state;
    if (isSetChanged) {
      this.categoryOpacity.setValue(1);
      !breathingGameVisible && this.setState({breathingGameVisible: true});
      return;
    }
    this.fadeIn();
  };

  closeModal = () => {
    this.setState(
      {
        breathingGameVisible: false,
      },
      this.fadeIn(true),
    );
  };

  minimizeBreathingGame = () => {
    console.log('breathing game closing 1');
    this.props.closeBreathingGame();
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
    const {allContents, activeIndex, backgroundImage} = this.props;
    const {breathingGameVisible} = this.state;
    const activeContent = allContents[activeIndex];
    const isBookmarked = activeContent
      ? activeContent.isBookmark || activeContent.bookmarkedNow
      : false;
    const contentAvailable = allContents[activeIndex];
    const contentTag = contentAvailable ? allContents[activeIndex].tag : null;
    const contentText = contentAvailable ? allContents[activeIndex].text : null;
    const scrollEnabled = this.state.scrollActive && !isBookmarked;
    console.log('breathing game visible', this.props.showBreathingGame);
    return (
      <ImageBackground style={styles.container} source={backgroundImage}>
        <View style={styles.categoryHolder}>
          <Animated.Text style={styles.category}>{contentTag}</Animated.Text>
        </View>
        {!breathingGameVisible ? (
          <TouchableOpacity
            onPress={this.props.closeSheet}
            style={styles.iconDownContainer}>
            <Animated.Image source={downIcon} style={styles.iconDown} />
          </TouchableOpacity>
        ) : null}
        <SafeAreaView style={styles.contentContainer}>
          <View style={styles.topRow} />
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
          <TouchableOpacity
            onPress={this.handleBookmark}
            style={styles.bookmarkIconContainer}>
            <Animated.Image
              source={bookmarkIcon}
              style={[
                styles.bookmarkIcon,
                isBookmarked && styles.bookmarkColor,
              ]}
            />
          </TouchableOpacity>
        </SafeAreaView>
        {breathingGameVisible ? (
          <View
            style={{
              height: ScreenHeight,
              width: ScreenWidth,
              ...StyleSheet.absoluteFillObject,
            }}>
            <BrethingGame
              closeModal={this.closeModal}
              contentTag={contentTag}
              minimize={this.minimizeBreathingGame}
            />
          </View>
        ) : null}
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {contents, categories, loginInfo} = state;
  return {
    allContents: contents.allContents,
    activeIndex: contents.activeIndex,
    categories,
    loginInfo,
  };
};

export default connect(mapStateToProps)(Content);
