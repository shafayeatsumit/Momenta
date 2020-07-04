import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  ImageBackground,
  TouchableOpacity,
  AppState,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';
import {
  fetchTags,
  fetchBackground,
  anonymousSignup,
  removeBackground,
  fetchContent,
  moveFirstSetToLast,
  removeContent,
} from '../../redux/actions/tag';
import BrethingGame from '../breathingGame/BreathingGame';
import SplashScreen from '../../../assets/images/splash.png';
import MeditaionExplainer from './explainer_modals/MeditaitonExplainer';
import styles from './Home.styles';
import analytics from '@react-native-firebase/analytics';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breathingGameVisible: true,
      nextButtonVisible: false,
      onScreenTagName: '',
      onScreenContent: '',
      onScreenSetId: null,
      onScreenTagId: null,
      appState: AppState.currentState,
      pressInParent: false,
    };

    this.tagOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.imageOpacity = new Animated.Value(1);
    this.modalTimer = null;
    this.imageSwitchTimer = null;
  }

  fadeInContent = () => {
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

  fadeOutContent = () => {
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

  hideNextButton = () => this.setState({nextButtonVisible: false});
  showNextButton = () =>
    this.setState({nextButtonVisible: true, breathingGameVisible: false});

  findTag = () => {
    const {currentSession, settings} = this.props;
    const selectedTags = settings.selectedTags;
    const lastSeenTag = currentSession.lastSeenTag;
    console.log('lastSeenTag', lastSeenTag);
    if (!lastSeenTag) {
      return selectedTags[0];
    }
    const selectedTagIndex = selectedTags.indexOf(lastSeenTag);
    if (selectedTagIndex + 1 === selectedTags.length) {
      return selectedTags[0];
    } else {
      return selectedTags[selectedTagIndex + 1];
    }
  };

  getContent = (sets) => {
    const firstSetId = sets[0];
    const content = this.getContentBySetId(firstSetId);
    const contentText = content ? content.text : '';
    return contentText;
  };

  showContent = () => {
    const tagId = this.findTag();
    const tagName = this.getTagNameById(tagId);
    const sets = this.getSetsByTagId(tagId);
    const content = this.getContent(sets);
    console.log('show content tagId', tagId);
    this.props.dispatch({type: 'LAST_SEEN_TAG', tag: tagId});
    this.setState(
      {
        breathingGameVisible: false, // close the breathing game hrere.
        onScreenContent: content,
        onScreenTagName: tagName,
        onScreenTagId: tagId,
      },
      () => this.fadeInContent(),
    );
  };

  closeBreathingGame = () => this.setState({breathingGameVisible: false});

  showBreathingGame = () => {
    this.setState({breathingGameVisible: true});
    this.imageOpacity.setValue(1);
  };

  goToNextBreathing = () => {
    const {dispatch} = this.props;
    this.closeBreathingGame();
    dispatch(fetchBackground());
    dispatch(removeBackground()).then(() => {
      this.showBreathingGame();
    });
  };

  getTagIdByName = (tagName) =>
    this.props.tagNames.find((tag) => tag.name === tagName).id;

  getSetsByTagId = (tagId) => this.props.tags[tagId].sets;

  getContentBySetId = (setId) => this.props.sets[setId].contents[0];

  getTagNameById = (id) =>
    this.props.tagNames.find((tag) => tag.id === id).name;

  openBreathingGame = () => {
    this.openBreathingGameID = setTimeout(() => {
      this.setState({breathingGameVisible: true});
      this.imageOpacity.setValue(1);
      this.openBreathingGameID && clearTimeout(this.openBreathingGameID);
    }, 500);
  };

  handleNext = () => {
    const {onScreenTagId} = this.state;
    const {dispatch} = this.props;
    this.fadeOutContent();
    dispatch(fetchBackground());
    this.setState(
      {
        breathingGameVisible: true,
        nextButtonVisible: false,
      },
      () => dispatch(removeBackground()),
    );
    // TODO: uncomment below.
    dispatch(removeContent(onScreenTagId));
    dispatch(fetchContent(onScreenTagId));
  };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.props.dispatch({type: 'RESET_SESSION'});
    }
    this.setState({appState: nextAppState});
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
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    this.slideTimerId && clearTimeout(this.slideTimerId);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  render() {
    const {backgrounds, navigation} = this.props;
    const {
      breathingGameVisible,
      onScreenTagName,
      onScreenContent,
      nextButtonVisible,
    } = this.state;
    const backgroundImage = backgrounds[0];
    console.log('backgrounds', backgrounds.length);
    console.log('last seen', this.props.currentSession.lastSeenTag);
    if (!backgroundImage) {
      return (
        <ImageBackground style={styles.imageContainer} source={SplashScreen} />
      );
    }
    return (
      <View style={styles.container}>
        <Animated.Image
          style={[styles.imageContainer, {opacity: this.imageOpacity}]}
          source={backgroundImage}
        />

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
        </SafeAreaView>
        {nextButtonVisible ? (
          <TouchableOpacity style={styles.nextButton} onPress={this.handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : null}
        {breathingGameVisible ? (
          <View style={styles.breathingGameContainer}>
            <BrethingGame
              backgroundImage={backgroundImage}
              imageFadeOut={this.imageFadeOut}
              navigation={navigation}
              goToNextBreathing={this.goToNextBreathing}
              showContent={this.showContent}
              pressInParent={this.state.pressInParent}
              pressOutParent={this.state.pressOutParent}
            />
          </View>
        ) : null}
        {!nextButtonVisible ? (
          <TouchableOpacity
            onPressIn={() =>
              this.setState({pressInParent: true, pressOutParent: false})
            }
            onPressOut={() =>
              this.setState({pressOutParent: true, pressInParent: false})
            }
            style={styles.touchHandler}
          />
        ) : null}
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
    settings,
    onboardingCompleted,
    currentSession,
  } = state;
  return {
    sets,
    tags,
    tagNames,
    backgrounds,
    userInfo,
    settings,
    currentSession,
    onboardingCompleted,
  };
};

export default connect(mapStateToProps)(Home);
