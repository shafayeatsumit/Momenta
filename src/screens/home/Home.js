import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';
import {
  fetchTags,
  fetchBackground,
  anonymousSignup,
  moveFirstSetToLast,
  activateTag,
  fetchContent,
  removeContent,
} from '../../redux/actions/tag';
import {handleFavorite} from '../../redux/actions/favorites';
import BrethingGame from '../breathingGame/BreathingGame';
import BreathingTipExplainer from './explainer_modals/BreathingTipExplainer';
import MeditaionExplainer from './explainer_modals/MeditaitonExplainer';
import styles from './Home.styles';
import starIcon from '../../../assets/icons/star_icon.png';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import analytics from '@react-native-firebase/analytics';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breathingGameVisible: true,
      breathingTipExplainerVisible: false,
      meditationExplainerVisible: false,
      nextButtonVisible: false,
      onScreenTagName: '',
      onScreenContent: '',
      onScreenSetId: null,
      onScreenTagId: null,
      breathCountVisible: true,
    };

    this.tagOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.imageOpacity = new Animated.Value(1);
    this.modalTimer = null;
    this.imageSwitchTimer = null;
  }
  changeBackground = () => this.props.dispatch({type: 'REMOVE_BACKGROUND'});

  fadeIn = () => {
    Animated.timing(this.tagOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 0,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.contentOpacity, {
      toValue: 1,
      duration: 1500,
      delay: 500,
      useNativeDriver: true,
    }).start(this.showNextButton);
  };

  fadeOut = () => {
    this.tagOpacity.setValue(0);
    this.contentOpacity.setValue(0);
  };

  imageFadeOut = () => {
    const {settings} = this.props;
    const {exhaleTime} = settings;
    Animated.timing(this.imageOpacity, {
      toValue: 0,
      duration: exhaleTime * 1000,
      useNativeDriver: true,
    }).start();
  };

  imageFadeIn = (cb) => {
    const {breathCountVisible} = this.state;
    breathCountVisible && this.setState({breathCountVisible: false});
    const {settings, dispatch} = this.props;
    const {exhaleTime} = settings;
    this.changeBackground();
    Animated.timing(this.imageOpacity, {
      toValue: 1,
      duration: exhaleTime * 1000,
      useNativeDriver: true,
    }).start(cb);
    dispatch(fetchBackground());
  };

  getActiveTag = (tagIndex) => {
    const {tagNames, settings} = this.props;
    const {selectedTags} = settings;
    const activeTagId = selectedTags[tagIndex];
    const activeTag = tagNames.find((item) => item.id === activeTagId);
    return activeTag;
  };

  showBreathCount = () => this.setState({breathCountVisible: true});

  hideBreathCount = () => this.setState({breathCountVisible: false});

  getActiveTagIndex = () => {
    const {tagNames, tags, settings} = this.props;
    const selectedTags = tagNames.filter((item) =>
      settings.selectedTags.includes(item.id),
    );
    const activeTagIndex = selectedTags.findIndex((item) => item.active);
    const noActiveTag = activeTagIndex === -1;
    const lastTagIsActive = activeTagIndex === selectedTags.length - 1;

    if (noActiveTag || lastTagIsActive) {
      return 0;
    }
    const isNextTagFavorites =
      selectedTags[activeTagIndex + 1].name === 'Favorites';
    // if next tag is favorite and no set then skip to 0.
    if (isNextTagFavorites) {
      const favoritesTagId = this.getTagIdByName('Favorites');
      const hasFvoriteSet = tags[favoritesTagId].sets.length;
      return hasFvoriteSet ? activeTagIndex + 1 : 0;
    } else {
      return activeTagIndex + 1;
    }
  };

  hideNextButton = () => this.setState({nextButtonVisible: false});
  showNextButton = () => this.setState({nextButtonVisible: true});

  getActiveTagSets = (activeTagIndex) => {
    const {tagNames, tags} = this.props;
    const activeTagId = tagNames[activeTagIndex].id;
    const activeSets = tags[activeTagId].sets;
    return activeSets;
  };

  getFavoriteTagName = (setId) => {
    const {sets} = this.props;
    const favoriteSet = sets[setId];
    const tagName = favoriteSet.tags ? favoriteSet.tags[0].name : null;
    return tagName;
  };

  showContent = () => {
    const {dispatch} = this.props;
    const activeTagIndex = this.getActiveTagIndex();
    dispatch(activateTag(activeTagIndex));
    const activeTag = this.getActiveTag(activeTagIndex);
    const tagName = activeTag.name;
    const activeSets = this.getActiveTagSets(activeTagIndex);
    const firstSetId = activeSets[0];
    const content = this.getContentBySetId(firstSetId);
    const contentText = content ? content.text : '';
    const onScreenTagName =
      tagName === 'Favorites' ? this.getFavoriteTagName(firstSetId) : tagName;
    this.setState(
      {
        onScreenContent: contentText,
        onScreenTagName: onScreenTagName,
        onScreenSetId: firstSetId,
        onScreenTagId: activeTag.id,
      },
      this.fadeIn,
    );
  };

  goToNextBreathing = () => {
    const {dispatch} = this.props;
    const {breathCountVisible} = this.state;
    dispatch(fetchBackground());
    this.modalTimer = setTimeout(() => {
      this.setState({breathingGameVisible: true});
      clearTimeout(this.modalTimer);
      this.imageOpacity.setValue(1);
    }, 1000);
    this.imageSwitchTimer = setTimeout(() => {
      this.changeBackground();
      // breathCountVisible && this.setState({breathCountVisible: false});
      clearTimeout(this.imageSwitchTimer);
    }, 500);
  };

  firstTimeUser = () => {
    const {firstLaunch} = this.props;
    return !firstLaunch.onboardingCompleted;
  };

  getTagIdByName = (tagName) =>
    this.props.tagNames.find((tag) => tag.name === tagName).id;

  getSetsByTagId = (tagId) => this.props.tags[tagId].sets;

  getContentBySetId = (setId) => this.props.sets[setId].contents[0];

  showBreathingTipExplainer = () =>
    this.setState({breathingTipExplainerVisible: true});

  showMeditationExplainer = () =>
    this.setState({meditationExplainerVisible: true});

  showContentByTagName = (tagName) => {
    const tagId = this.getTagIdByName(tagName);
    const tagSets = this.getSetsByTagId(tagId);
    const firstSetId = tagSets[0];
    const content = this.getContentBySetId(firstSetId);
    const contentText = content ? content.text : '';
    this.setState(
      {
        onScreenContent: contentText,
        onScreenTagName: tagName,
        onScreenSetId: firstSetId,
        onScreenTagId: tagId,
      },
      this.fadeIn,
    );
  };

  newUserAction = () => {
    const {firstLaunch, dispatch} = this.props;
    const {breathCount} = firstLaunch;
    if (breathCount === 0) {
      dispatch({type: 'NEW_USER_INCREASE_BREATH_COUNT'});
      this.goToNextBreathing();
    } else if (breathCount === 1) {
      dispatch({type: 'NEW_USER_INCREASE_BREATH_COUNT'});
      this.imageFadeIn(this.showBreathingTipExplainer);
      // this.showBreathingTipExplainer();
    } else {
      dispatch({type: 'NEW_USER_ONBOARDING_COMPLETED'});
      this.imageFadeIn(this.showMeditationExplainer);
      // this.showMeditationExplainer();
    }
  };

  oldUserAction = () => {
    const {userInfo, dispatch} = this.props;
    const userSeesContent = (userInfo.breathCount + 1) % 3 === 0;
    dispatch({type: 'INCREASE_PLAY_COUNT'});
    if (userSeesContent) {
      this.imageFadeIn(this.showContent);
    } else {
      this.goToNextBreathing();
    }
  };

  closeBreathingTipExplainer = () => {
    this.setState({breathingTipExplainerVisible: false});
    const tagName = 'Breathing Tip';
    this.showContentByTagName(tagName);
  };

  closeMeditationExplainer = () => {
    this.setState({meditationExplainerVisible: false});
    const tagName = 'Gratitude';
    this.showContentByTagName(tagName);
  };

  closeBreathingGame = () => {
    this.setState({breathingGameVisible: false});
    const isFirstTimeUser = this.firstTimeUser();
    if (!isFirstTimeUser) {
      this.oldUserAction();
    } else {
      this.newUserAction();
    }
  };

  handleStar = () => {
    const {dispatch} = this.props;
    const {onScreenSetId} = this.state;
    dispatch(handleFavorite(onScreenSetId));
  };

  getTotalBreathCount = () => {
    const {userInfo, firstLaunch} = this.props;
    const totalNumberOfBreaths = userInfo.breathCount + firstLaunch.breathCount;
    return totalNumberOfBreaths.toLocaleString();
  };

  handleNext = () => {
    const {onScreenTagName, onScreenSetId, onScreenTagId} = this.state;
    const {dispatch} = this.props;
    this.fadeOut();
    this.setState(
      {
        breathingGameVisible: true,
        nextButtonVisible: false,
        breathCountVisible: true,
      },
      this.changeBackground,
    );
    const isFavoriteOrBreathingTip =
      onScreenTagName === 'Favorites' || onScreenTagName === 'Breathing Tip';

    if (isFavoriteOrBreathingTip) {
      dispatch(moveFirstSetToLast(onScreenTagId));
    } else {
      const favoritesTagId = this.getTagIdByName('Favorites');
      dispatch(removeContent(onScreenTagId, onScreenSetId, favoritesTagId));
      dispatch(fetchContent(onScreenTagId));
    }
    dispatch(fetchBackground());
  };

  componentDidMount() {
    const {userInfo, dispatch, sets} = this.props;
    const hasSets = Object.keys(sets).length;
    if (!userInfo.token) {
      dispatch(anonymousSignup());
    } else {
      !hasSets && dispatch(fetchTags());
    }
    userInfo.userId && analytics().setUserId(userInfo.userId.toString());
  }
  componentWillUnmount() {
    this.slideTimerId && clearTimeout(this.slideTimerId);
  }

  render() {
    const {backgrounds, sets, firstLaunch, navigation} = this.props;
    const {
      breathingGameVisible,
      breathingTipExplainerVisible,
      meditationExplainerVisible,
      onScreenTagName,
      onScreenContent,
      onScreenSetId,
      nextButtonVisible,
      breathCountVisible,
    } = this.state;
    const backgroundImage = backgrounds[0];
    const onScreenSet = sets[onScreenSetId];
    const isFavorite = onScreenSet ? onScreenSet.isBookmark : false;
    const showStar =
      firstLaunch.onboardingCompleted &&
      nextButtonVisible &&
      onScreenTagName !== 'Breathing Tip'
        ? true
        : false;
    console.log('backgrounds length', backgrounds.length);
    if (!backgroundImage) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(120,121,137)" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Animated.Image
          style={[styles.imageContainer, {opacity: this.imageOpacity}]}
          source={backgroundImage}
        />
        {breathCountVisible ? (
          <View style={styles.breathCountContainer}>
            <Text style={[styles.breathCountText]}>Calm Breaths</Text>
            <Text style={styles.breathCountText}>
              {this.getTotalBreathCount()}
            </Text>
          </View>
        ) : null}
        <View style={styles.categoryHolder}>
          <Animated.Text style={[styles.category, {opacity: this.tagOpacity}]}>
            {onScreenTagName}
          </Animated.Text>
        </View>

        <SafeAreaView style={styles.contentContainer}>
          <Animated.Text
            style={[styles.content, {opacity: this.contentOpacity}]}>
            {onScreenContent}
          </Animated.Text>

          {nextButtonVisible ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={this.handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : null}
          {showStar ? (
            <TouchableOpacity
              onPress={this.handleStar}
              style={styles.starIconContainer}>
              <Image
                source={starIcon}
                style={[styles.starIcon, isFavorite && styles.starColor]}
              />
            </TouchableOpacity>
          ) : null}
        </SafeAreaView>
        {breathingGameVisible ? (
          <View
            style={{
              height: ScreenHeight,
              width: ScreenWidth,
              ...StyleSheet.absoluteFillObject,
            }}>
            <BrethingGame
              backgroundImage={backgroundImage}
              closeBreathingGame={this.closeBreathingGame}
              imageFadeOut={this.imageFadeOut}
              navigation={navigation}
              showBreathCount={this.showBreathCount}
              breathCountVisible={breathCountVisible}
              hideBreathCount={this.hideBreathCount}
            />
          </View>
        ) : null}

        <Modal
          visible={breathingTipExplainerVisible}
          transparent={true}
          animationType="fade">
          <BreathingTipExplainer closeModal={this.closeBreathingTipExplainer} />
        </Modal>
        <Modal
          visible={meditationExplainerVisible}
          transparent={true}
          animationType="fade">
          <MeditaionExplainer closeModal={this.closeMeditationExplainer} />
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    sets,
    tags,
    tagNames,
    backgrounds,
    userInfo,
    firstLaunch,
    settings,
  } = state;
  return {sets, tags, tagNames, backgrounds, userInfo, firstLaunch, settings};
};

export default connect(mapStateToProps)(Home);
