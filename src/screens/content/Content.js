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
import {bookmarkSet, rejectSet} from '../../redux/actions/contents';
import {deleteSet, fetchContent} from '../../redux/actions/tag';
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

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breathingGameVisible:
        props.onScreen.setId === null || props.showBreathingGame,
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

  closeBreathingGame = () => {
    this.setState({breathingGameVisible: false}, this.fadeIn);
  };

  changeBackground = () => this.props.dispatch({type: 'REMOVE_BACKGROUND'});

  minimizeBreathingGame = () => this.props.closeBreathingGame();

  goToNextSet = () => {
    this.fadeOut();
    this.setState({breathingGameVisible: true}, this.changeBackground);
    const {dispatch, tags, selectedTags, onScreen} = this.props;
    const activeTagIndex = selectedTags.indexOf(onScreen.tagId);
    const currentTag = tags[onScreen.tagId];
    // if one selected tag , then next tag is the current tag;
    const nextTag =
      selectedTags.length - 1 === activeTagIndex
        ? selectedTags[0]
        : selectedTags[activeTagIndex + 1];
    // TODO: for random get a sample _.sample(tags)
    // if next tag is
    const nextTagSets = tags[nextTag].sets;
    const nextTagName = tags[nextTag].name;
    const nextSet = nextTagSets[0];
    dispatch(deleteSet());
    dispatch(fetchContent(currentTag));
    dispatch({
      type: 'NEXT_SET',
      tagId: nextTag,
      setId: nextSet,
      tagName: nextTagName,
    });
  };

  startContent = () => {
    const {dispatch, tags, selectedTags} = this.props;
    const firstTagId = selectedTags[0];
    const activeTag = tags[firstTagId];
    // TODO: for random get a sample _.sample(tags)
    const activeSet = activeTag.sets[0];
    const payload = {
      tagId: firstTagId,
      setId: activeSet,
      tagName: activeTag.name,
    };

    dispatch({type: 'UPDATE_ONSCREEN_CONTENT', payload});
  };

  // componentDidUpdate(prevProps, prevState) {
  //   const {breathingGameVisible} = this.state;
  //   const {onScreen} = this.props;
  //   const isSetChanged = onScreen.set !== prevProps.onScreen.set;
  // }

  componentDidMount() {
    const {onScreen} = this.props;
    // if no tag selected
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
            <BrethingGame
              closeModal={this.closeBreathingGame}
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
  const {sets, tags, selectedTags, backgrounds, onScreen} = state;
  return {sets, tags, selectedTags, backgrounds, onScreen};
};

export default connect(mapStateToProps)(Content);
