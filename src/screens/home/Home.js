import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';
import {
  fetchTags,
  fetchBackground,
  anonymousSignup,
  rearrangeBreathingTip,
  activateTag,
  fetchContent,
  removeContent,
} from '../../redux/actions/tag';
import BrethingGame from '../breathingGame/BreathingGame';

import MeditaionExplainer from './explainer_modals/MeditaitonExplainer';
import styles from './Home.styles';
import analytics from '@react-native-firebase/analytics';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breathingGameVisible: true,
      meditationExplainerVisible: false,
      nextButtonVisible: false,
      onScreenTagName: '',
      onScreenContent: '',
      onScreenSetId: null,
      onScreenTagId: null,
    };

    this.tagOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.imageOpacity = new Animated.Value(1);
    this.modalTimer = null;
    this.imageSwitchTimer = null;
  }
  changeBackground = () => this.props.dispatch({type: 'REMOVE_BACKGROUND'});

  fadeInContent = (tagDuration, contentDuration, contentDelay, cb) => {
    Animated.timing(this.tagOpacity, {
      toValue: 1,
      duration: tagDuration ? tagDuration : 1000,
      delay: 0,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.contentOpacity, {
      toValue: 1,
      duration: contentDuration ? contentDuration : 1500,
      delay: contentDelay ? contentDelay : 500,
      useNativeDriver: true,
    }).start(() => {
      cb && cb();
    });
  };

  breathingTipFadeOut = () => {
    const {dispatch} = this.props;
    Animated.parallel([
      Animated.timing(this.tagOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(this.contentOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => dispatch(rearrangeBreathingTip()));
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
  showNextButton = () => this.setState({nextButtonVisible: true});

  closeBreathingGame = () => {
    const {dispatch, settings} = this.props;
    const duration = settings.exhaleTime * 1000;
    dispatch(fetchBackground());
    this.imageSwitchTimer = setTimeout(() => {
      // TODO: need to uncoment this.
      this.changeBackground();
      this.setState({breathingGameVisible: false});
      clearTimeout(this.imageSwitchTimer);
    }, duration);
  };

  showBreathingGame = () => {
    const {settings} = this.props;
    const duration = settings.exhaleTime * 1000;
    this.modalTimer = setTimeout(() => {
      this.setState({breathingGameVisible: true});
      this.imageOpacity.setValue(1);
      clearTimeout(this.modalTimer);
    }, duration + 500);
  };

  goToNextBreathing = () => {
    this.closeBreathingGame();
    this.showBreathingGame();
  };

  getTagIdByName = (tagName) =>
    this.props.tagNames.find((tag) => tag.name === tagName).id;

  getSetsByTagId = (tagId) => this.props.tags[tagId].sets;

  getContentBySetId = (setId) => this.props.sets[setId].contents[0];

  showMeditationExplainer = () =>
    this.setState({meditationExplainerVisible: true});

  openBreathingGame = () => {
    this.openBreathingGameID = setTimeout(() => {
      this.setState({breathingGameVisible: true});
      this.imageOpacity.setValue(1);
      this.openBreathingGameID && clearTimeout(this.openBreathingGameID);
    }, 500);
  };

  breathingTipFadeIn = () => {
    const {breathingTip} = this.props;
    const firstSetId = breathingTip.sets[0];
    const content = this.getContentBySetId(firstSetId);
    const contentText = content ? content.text : '';
    this.setState(
      {
        onScreenContent: contentText,
        onScreenTagName: 'Breathing Tip',
      },
      () => this.fadeInContent(800, 800, 300),
    );
  };

  showBreathingTip = () => {
    const {settings} = this.props;
    this.breathingTipFadeIn();
    const fadeOutAfter = settings.exhaleTime * 1000 - 250;
    this.breathingTipTimer = setTimeout(() => {
      this.breathingTipFadeOut();
      this.setState({breathingGameVisible: false}, this.openBreathingGame);
      this.breathingTipTimer && clearTimeout(this.breathingTipTimer);
    }, fadeOutAfter);
  };

  closeMeditationExplainer = () => {
    this.setState({meditationExplainerVisible: false});
  };

  handleNext = () => {
    const {onScreenTagId} = this.state;
    const {dispatch} = this.props;
    this.fadeOutContent();
    this.setState(
      {
        breathingGameVisible: true,
        nextButtonVisible: false,
      },
      this.changeBackground,
    );
    dispatch(removeContent(onScreenTagId));
    dispatch(fetchContent(onScreenTagId));
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
    const {backgrounds, navigation} = this.props;
    const {
      breathingGameVisible,
      meditationExplainerVisible,
      onScreenTagName,
      onScreenContent,
      nextButtonVisible,
    } = this.state;
    const backgroundImage = backgrounds[0];

    console.log('backgrounds length', backgrounds.length);
    console.log(
      'breathing game visible',
      breathingGameVisible,
      this.imageOpacity,
    );
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
        </SafeAreaView>
        {breathingGameVisible ? (
          <View style={styles.breathingGameContainer}>
            <BrethingGame
              backgroundImage={backgroundImage}
              imageFadeOut={this.imageFadeOut}
              navigation={navigation}
              goToNextBreathing={this.goToNextBreathing}
              showBreathingTip={this.showBreathingTip}
            />
          </View>
        ) : null}

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
    settings,
    onboardingCompleted,
    breathingTip,
  } = state;
  return {
    sets,
    tags,
    tagNames,
    backgrounds,
    userInfo,
    settings,
    breathingTip,
    onboardingCompleted,
  };
};

export default connect(mapStateToProps)(Home);
