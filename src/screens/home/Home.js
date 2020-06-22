import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
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
      backgroundBlurRadius:50,      
    };

    this.tagOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.iconOpacity = new Animated.Value(0);
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
    this.setState({});
  };

  getActiveTag = (tagIndex) => {
    const {tagNames} = this.props;
    const activeTag = tagNames[tagIndex];
    return activeTag;
  };

  getActiveTagIndex = () => {
    const {tagNames, tags} = this.props;
    const selectedTags = tagNames.filter((item) => item.selected);
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
    this.setState(
      {
        onScreenContent: contentText,
        onScreenTagName: tagName,
        onScreenSetId: firstSetId,
        onScreenTagId: activeTag.id,
      },
      this.fadeIn,
    );
  };

  goToNextBreathing = () => {
    const {dispatch} = this.props;
    dispatch(fetchBackground());
    this.modalTimer = setTimeout(() => {
      this.setState({breathingGameVisible: true, backgroundBlurRadius:50});
      clearTimeout(this.modalTimer);
    }, 2000);
    this.imageSwitchTimer = setTimeout(() => {
      this.changeBackground();
      clearTimeout(this.imageSwitchTimer);
    }, 2500);
  };

  firstTimeUser = () => {
    const {firstLaunch} = this.props;
    return !firstLaunch.onboardingDone;
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
    const {playCount} = firstLaunch;
    if (playCount === 1) {
      this.goToNextBreathing();
      dispatch({type: 'NEW_USER_INCREASE_PLAY_COUNT'});
    } else if (playCount === 2) {
      this.showBreathingTipExplainer();
      dispatch({type: 'NEW_USER_INCREASE_PLAY_COUNT'});
    } else {
      this.showMeditationExplainer();
      dispatch({type: 'NEW_USER_ONBOARDING_DONE'});
    }
  };

  oldUserAction = () => {
    const {userInfo, dispatch} = this.props;
    const userSeesContent = userInfo.playCount % 3 === 0;
    if (userSeesContent) {
      this.showContent();
    } else {
      this.goToNextBreathing();
    }
    dispatch({type: 'INCREASE_PLAY_COUNT'});
  };

  closeBreathingTipExplainer = () => {
    this.setState({breathingTipExplainerVisible: false});
    const tagName = 'Calm Breathing Tips';
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

  handleNext = () => {
    const {onScreenTagName, onScreenSetId, onScreenTagId} = this.state;
    const {dispatch} = this.props;
    this.fadeOut();
    this.setState(
      {breathingGameVisible: true, backgroundBlurRadius:50, nextButtonVisible: false},
      this.changeBackground,
    );
    const isFavoriteOrBreathingTip =
      onScreenTagName === 'Favorites' ||
      onScreenTagName === 'Calm Breathing Tips';

    if (isFavoriteOrBreathingTip) {
      dispatch(moveFirstSetToLast(onScreenTagId));
    } else {
      const favoritesTagId = this.getTagIdByName('Favorites');
      dispatch(removeContent(onScreenTagId, onScreenSetId, favoritesTagId));
      dispatch(fetchContent(onScreenTagId));
    }
    dispatch(fetchBackground());
  };

  unblurBackground =()=> this.setState({backgroundBlurRadius:1})

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
    const {backgrounds} = this.props;
    const {
      breathingGameVisible,
      breathingTipExplainerVisible,
      meditationExplainerVisible,
      onScreenTagName,
      onScreenContent,
      nextButtonVisible,
      backgroundBlurRadius
    } = this.state;
    const backgroundImage = backgrounds[0];
    if (!backgroundImage) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(120,121,137)" />
        </View>
      );
    }

    return (
      <ImageBackground         
        style={styles.container} 
        source={backgroundImage} 
        blurRadius={backgroundBlurRadius}        
      >
        <View style={styles.categoryHolder}>
          <Animated.Text style={[styles.category, {opacity: this.tagOpacity}]}>
            {onScreenTagName}
          </Animated.Text>
        </View>

        <SafeAreaView style={styles.contentContainer}>
          <View style={styles.topRow} />

          <View activeOpacity={0.7} style={styles.slideContainer}>
            <View key={0} style={{width: ScreenWidth}}>
              <View style={styles.categoryContainer} />
              <View style={styles.thoughtContainer}>
                <Animated.Text
                  style={[styles.content, {opacity: this.contentOpacity}]}>
                  {onScreenContent}
                </Animated.Text>
              </View>
            </View>
            <View key={1} style={{width: ScreenWidth}} />
          </View>
          {nextButtonVisible ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={this.handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : null}
          {nextButtonVisible ? (
            <TouchableOpacity
              onPress={()=>console.log('favorite')}
              style={styles.bookmarkIconContainer}>
              <Image
                source={starIcon}
                style={[styles.bookmarkIcon, true && styles.bookmarkColor]}
              />
            </TouchableOpacity>          
          ):null}
        </SafeAreaView>
        <Modal
          visible={breathingGameVisible}
          transparent={true}
          animationType={'none'}>
          <View
            style={{
              height: ScreenHeight,
              width: ScreenWidth,
              ...StyleSheet.absoluteFillObject,
            }}>
            <BrethingGame 
              unblurBackground={this.unblurBackground}
              backgroundImage={backgroundImage} 
              closeBreathingGame={this.closeBreathingGame} 
            />
          </View>
        </Modal>
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
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {sets, tags, tagNames, backgrounds, userInfo, firstLaunch} = state;
  return {sets, tags, tagNames, backgrounds, userInfo, firstLaunch};
};

export default connect(mapStateToProps)(Home);
