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
  Text,
  Modal,
} from 'react-native';
import BrethingGame from '../breathingGame/BreathingGame';
import analytics from '@react-native-firebase/analytics';
import {handleFavorite} from '../../redux/actions/favorites';
import {
  deleteSet,
  fetchContent,
  fetchBackground,
  updateFavorites,
} from '../../redux/actions/tag';
import styles from './Content.styles';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import bookmarkIcon from '../../../assets/icons/bookmark.png';
import _ from 'lodash';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breathingGameVisible: true,
    };
    this.tagOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.iconOpacity = new Animated.Value(0);
  }

  fadeIn = () => {
    Animated.timing(this.tagOpacity, {
      toValue: 1,
      duration: 2500,
      delay: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.contentOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 0,
      useNativeDriver: true,
    }).start(this.contentSeen);
  };

  fadeOut = () => {
    this.tagOpacity.setValue(0);
    this.contentOpacity.setValue(0);
  };

  closeBreathingGame = () => this.setState({breathingGameVisible: false});

  changeBackground = () => this.props.dispatch({type: 'REMOVE_BACKGROUND'});

  handleFavoriteSet = () => {
    const {onScreen, dispatch} = this.props;
    dispatch(handleFavorite(onScreen.setId));
  };

  getRandomTag = (tags) => {
    const tagsToRandomize = Object.values(tags).filter(
      (tag) =>
        tag.name !== 'Random' &&
        tag.name !== 'Calm Breathing' &&
        tag.name !== 'Favorites',
    );
    return _.sample(tagsToRandomize);
  };

  getIdOfRandomTag = (tags) =>
    Object.values(tags).find((tag) => tag.name === 'Random').id;

  getCurrentTag = () => {
    const {tags, onScreen} = this.props;
    const currentTag = tags[onScreen.tagId];
    return currentTag;
  };

  getCurrentTagIndex = () => {
    const {tags, onScreen, selectedTags} = this.props;
    const currentTagId =
      onScreen.tagName === 'Random'
        ? this.getIdOfRandomTag(tags)
        : onScreen.tagId;
    const currentTagIndex = selectedTags.indexOf(currentTagId);
    return currentTagIndex;
  };

  getUpcomingTag = (currentTagIndex) => {
    const {tags, selectedTags} = this.props;
    const upcomingTagId =
      selectedTags.length - 1 === currentTagIndex
        ? selectedTags[0]
        : selectedTags[currentTagIndex + 1];
    // onScreenTagName can be Random/Favorite it will be used for minimizedview as well.
    let upcomingTag = tags[upcomingTagId];
    return upcomingTag;
  };

  getUpcomingSet = (upcomingTag) => {
    const {tags} = this.props;
    const upcomingSets = tags[upcomingTag.id].sets;
    const upcomingSet = upcomingSets[0];
    return upcomingSet;
  };

  contentCleanUp = (currentTag) => {
    const currentTagName = currentTag.name;
    const {dispatch} = this.props;
    if (currentTagName === 'Favorites') {
      dispatch(updateFavorites());
    } else if (currentTag === 'Calm Breathing') {
      // do nothing
    } else {
      dispatch(deleteSet());
      dispatch(fetchContent(currentTag));
    }
  };

  moveForward = (upcomingTag) => {
    const {tags, dispatch} = this.props;
    const upcomingTagName = upcomingTag.name;
    if (upcomingTagName === 'Random') {
      const randomTag = this.getRandomTag(tags);
      const randomSetId = randomTag.sets[0];
      dispatch({
        type: 'NEXT_SET',
        tagId: randomTag.id,
        setId: randomSetId,
        tagName: upcomingTagName,
      });
    } else {
      const upcomingSet = upcomingTag.sets[0];
      dispatch({
        type: 'NEXT_SET',
        tagId: upcomingTag.id,
        setId: upcomingSet,
        tagName: upcomingTagName,
      });
    }
  };

  goToNextSet = () => {
    const {dispatch} = this.props;
    this.fadeOut();
    this.setState({breathingGameVisible: true}, this.changeBackground);
    dispatch(fetchBackground());
    const currentTagIndex = this.getCurrentTagIndex();
    const currentTag = this.getCurrentTag(currentTagIndex);
    const upcomingTag = this.getUpcomingTag(currentTagIndex);
    this.contentCleanUp(currentTag);
    this.moveForward(upcomingTag);
  };

  startContent = () => {
    const {dispatch, tags, selectedTags} = this.props;
    const firstTagId = selectedTags[0];
    let activeTag = tags[firstTagId];
    const activeTagName = activeTag.name;
    if (activeTag.name === 'Random') {
      activeTag = this.getRandomTag(tags);
    }
    const activeSet = activeTag.sets[0];
    const payload = {
      tagId: activeTag.id,
      setId: activeSet,
      tagName: activeTagName,
    };

    dispatch({type: 'UPDATE_ONSCREEN_CONTENT', payload});
  };

  componentDidMount() {
    const {onScreen} = this.props;
    // if no tag is on screen
    !onScreen.tagId && this.startContent();
  }
  render() {
    const {backgrounds, tags, sets, onScreen} = this.props;
    const {breathingGameVisible} = this.state;
    const backgroundImage = backgrounds[0];
    const hasContent = onScreen.setId;
    const activeSet = hasContent ? sets[onScreen.setId] : null;
    const activeContents = activeSet ? activeSet.contents : null;
    const activeContent =
      activeContents && activeContents.length ? activeContents[0] : null;
    const activeContentText = activeContent ? activeContent.text : null;
    const contentTag = onScreen.tagId ? tags[onScreen.tagId].name : null;
    const isFavorite = activeSet ? activeSet.isBookmark : false;

    return (
      <ImageBackground style={styles.container} source={backgroundImage}>
        <View style={styles.categoryHolder}>
          <Animated.Text style={styles.category}>{contentTag}</Animated.Text>
        </View>

        <SafeAreaView style={styles.contentContainer}>
          <View style={styles.topRow} />

          <View activeOpacity={0.7} style={styles.slideContainer}>
            <View key={0} style={{width: ScreenWidth}}>
              <View style={styles.categoryContainer} />
              <View style={styles.thoughtContainer}>
                <Animated.Text
                  style={[styles.content, {opacity: this.contentOpacity}]}>
                  {activeContentText}
                </Animated.Text>
              </View>
            </View>
            <View key={1} style={{width: ScreenWidth}} />
          </View>
          <TouchableOpacity
            onPress={this.handleFavoriteSet}
            style={styles.bookmarkIconContainer}>
            <Animated.Image
              source={bookmarkIcon}
              style={[styles.bookmarkIcon, isFavorite && styles.bookmarkColor]}
            />
          </TouchableOpacity>
        </SafeAreaView>
        <TouchableOpacity style={styles.nextButton} onPress={this.goToNextSet}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
        {breathingGameVisible ? (
          <View
            style={{
              height: ScreenHeight,
              width: ScreenWidth,
              ...StyleSheet.absoluteFillObject,
            }}>
            <BrethingGame closeBreathingGame={this.closeBreathingGame} />
          </View>
        ) : null}
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {sets, tags, selectedTags, backgrounds, onScreen} = state;
  return {sets, tags, selectedTags, backgrounds, onScreen};
};

export default connect(mapStateToProps)(Content);
