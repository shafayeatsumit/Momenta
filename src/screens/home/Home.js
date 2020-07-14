import React, {Component} from 'react';
import {
  View,
  Text,
  Animated,
  ImageBackground,
  TouchableOpacity,
  AppState,
} from 'react-native';
import {connect} from 'react-redux';
import {
  fetchTags,
  fetchBackground,
  anonymousSignup,
  removeBackground,
  fetchContent,
  removeContent,
} from '../../redux/actions/tag';
import BrethingGame from '../breathingGame/BreathingGame';
import SplashScreen from '../../../assets/images/splash.png';
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
      onScreenTagId: null,
      appState: AppState.currentState,
      pressInParent: false,
    };

    this.tagOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.imageOpacity = new Animated.Value(1);
    // time
    this.pressInTime = null;
    this.pressOutTime = null;
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
    }).start(this.goToNextBreathing);
  };

  showNextButton = () =>
    this.setState({nextButtonVisible: true, breathingGameVisible: false});

  getSetsByTagId = (tagId) => this.props.tags[tagId].sets;

  getContentBySetId = (setId) => this.props.sets[setId].contents[0];

  getTagNameById = (id) =>
    this.props.tagNames.find((tag) => tag.id === id).name;

  findTag = () => {
    const {currentSession, settings} = this.props;
    const selectedTags = settings.selectedTags;
    const lastSeenTag = currentSession.lastSeenTag;
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
    analytics().logEvent('viewed_content', {
      content_id: content.id,
      set_id: firstSetId,
    });
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

  showBreathingGameWithDelay = () => {
    this.breathingDelayId = setTimeout(() => {
      this.showBreathingGame();
      clearTimeout(this.breathingDelayId);
    }, 300);
  };

  goToNextBreathing = () => {
    const {dispatch} = this.props;
    this.closeBreathingGame();
    dispatch(fetchBackground());
    dispatch(removeBackground()).then(() => {
      this.showBreathingGameWithDelay();
    });
  };

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
    dispatch(removeContent(onScreenTagId));
    dispatch(fetchContent(onScreenTagId));
    analytics().logEvent('pressed_next');
  };

  handlePressIn = () => {
    const {settings, backgrounds} = this.props;
    const backgroundId = backgrounds[0] ? backgrounds[0].id : null;
    this.pressInTime = new Date();
    if (this.pressOutTime) {
      const timeTakenExhale = ((new Date() - this.pressOutTime) / 1000).toFixed(
        1,
      );
      analytics().logEvent('exhale', {
        time_taken: Number(timeTakenExhale),
        exhale_time: settings.exhaleTime,
        background_id: backgroundId,
      });
    }
    this.setState({pressInParent: true, pressOutParent: false});
  };

  handlePressOut = () => {
    const {settings, backgrounds} = this.props;
    const backgroundId = backgrounds[0] ? backgrounds[0].id : null;
    this.pressOutTime = new Date();
    const timeTakeInhale = ((new Date() - this.pressInTime) / 1000).toFixed(1);
    analytics().logEvent('inhale', {
      time_taken: Number(timeTakeInhale),
      inhale_time: settings.inhale_time,
      background_id: backgroundId,
    });
    this.setState({pressOutParent: true, pressInParent: false});
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
    if (!backgroundImage) {
      return (
        <ImageBackground style={styles.imageContainer} source={SplashScreen} />
      );
    }
    return (
      <View style={styles.container}>
        <Animated.Image
          style={[styles.imageContainer, {opacity: this.imageOpacity}]}
          source={backgroundImage.uri}
        />

        <View style={styles.categoryHolder}>
          <Animated.Text style={[styles.category, {opacity: this.tagOpacity}]}>
            {onScreenTagName}
          </Animated.Text>
        </View>

        <View style={styles.contentContainer}>
          <Animated.Text
            style={[styles.content, {opacity: this.contentOpacity}]}>
            {onScreenContent}
          </Animated.Text>
        </View>
        {breathingGameVisible ? (
          <View style={styles.breathingGameContainer}>
            <BrethingGame
              backgroundImage={backgroundImage}
              imageFadeOut={this.imageFadeOut}
              navigation={navigation}
              showContent={this.showContent}
              pressInParent={this.state.pressInParent}
              pressOutParent={this.state.pressOutParent}
            />
          </View>
        ) : null}
        {nextButtonVisible ? (
          <TouchableOpacity style={styles.nextButton} onPress={this.handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPressIn={this.handlePressIn}
            onPressOut={this.handlePressOut}
            style={styles.touchHandler}
          />
        )}
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
  };
};

export default connect(mapStateToProps)(Home);
