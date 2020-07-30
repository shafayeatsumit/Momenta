import React, {Component} from 'react';
import {View, Text, Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {FontType, Colors} from '../../../helpers/theme';
import {connect} from 'react-redux';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import analytics from '@react-native-firebase/analytics';
import {removeContent, fetchContent} from '../../../redux/actions/tag';

class Meditation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onScreenTitle: '',
      onScreenContent: '',
      onScreenTagId: null,
      showCloseButton: false,
    };
    this.titleOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.progressOpacity = new Animated.Value(1);
  }

  showCloseButton = () => this.setState({showCloseButton: true});

  fadeInContent = () => {
    Animated.timing(this.titleOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.contentOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 500,
      useNativeDriver: true,
    }).start(this.showCloseButton);
  };

  fadeOutContent = () => {
    this.titleOpacity.setValue(0);
    this.contentOpacity.setValue(0);
    this.progressOpacity.setValue(0);
  };

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
    this.props.dispatch({type: 'LAST_SEEN_TAG', tag: tagId});
    this.setState(
      {
        onScreenContent: content,
        onScreenTitle: tagName,
        onScreenTagId: tagId,
      },
      this.fadeInContent,
    );
  };

  adjustContent = () => {
    const {onScreenTagId} = this.state;
    const {dispatch} = this.props;
    dispatch(removeContent(onScreenTagId));
    dispatch(fetchContent(onScreenTagId));
  };

  handleClose = () => {
    const {dispatch, onboarding, goToNextModal} = this.props;
    if (!onboarding.completed) {
      dispatch({type: 'ONBOARDING_COMPLETED'});
      this.props.goToNextBreathing();
    }
    this.adjustContent();
    this.fadeOutContent();
    goToNextModal();
  };

  componentDidMount() {
    this.timerId = setTimeout(this.showContent, 1000);
    const {onboarding} = this.props;
    onboarding.completed && this.props.goToNextBreathing();
  }

  handleContinue = () => {
    const {settings, dispatch, closeModal} = this.props;
    const {breathPerSession} = settings;
    this.adjustContent();
    dispatch({type: 'ADD_EXTRA_BREATH', breathCount: breathPerSession});
    closeModal();
  };

  getProgress = () => {
    const {settings, currentSession} = this.props;
    const totalBreath =
      settings.breathPerSession + currentSession.additionalBreath;
    return (
      <Text style={[styles.progressText, styles.progressTextBig]}>
        {currentSession.breathCount}
        <Text style={styles.progressText}>/{totalBreath}</Text>
      </Text>
    );
  };

  componentWillUnmount() {
    this.timerId && clearTimeout(this.timerId);
  }

  render() {
    const {onScreenContent, onScreenTitle} = this.state;
    const {onboarding} = this.props;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.progressContainer} pointerEvents="none">
          <Animated.Text
            style={[styles.progressText, {opacity: this.progressOpacity}]}>
            {this.getProgress()}
          </Animated.Text>
        </View>
        <View style={styles.contentHolder}>
          <View style={styles.titleHolder}>
            <Animated.Text
              allowFontScaling={false}
              style={[styles.title, {opacity: this.titleOpacity}]}>
              {onScreenTitle}
            </Animated.Text>
          </View>
          <View style={styles.medTextHolder}>
            <Animated.Text
              allowFontScaling={false}
              style={[styles.medText, {opacity: this.titleOpacity}]}>
              {onScreenContent}
            </Animated.Text>
          </View>
        </View>

        {onboarding.completed ? (
          <View style={styles.smallButtonContainer}>
            <TouchableOpacity
              style={styles.buttonFinish}
              onPress={this.handleClose}>
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonContinue}
              onPress={this.handleContinue}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.bigButton} onPress={this.handleClose}>
            <Text style={styles.bigButtonText}>Finish</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {onboarding, currentSession, settings, tagNames, tags, sets} = state;
  return {onboarding, currentSession, settings, tagNames, tags, sets};
};

export default connect(mapStateToProps)(Meditation);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: '5%',
    height: 40,
    width: 44,
    alignSelf: 'center',
    zIndex: 1,
  },
  progressText: {
    fontFamily: FontType.Light,
    fontSize: 18,
    color: 'rgb(120,121,137)',
    textAlign: 'center',
  },
  progressTextBig: {
    fontSize: 36,
  },

  contentHolder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 18,
  },

  titleHolder: {
    height: 22,
    bottom: 46,
    left: 25,
    alignSelf: 'flex-start',
  },

  medTextHolder: {
    height: 235,
    width: 325,
    alignSelf: 'center',
  },
  medText: {
    fontFamily: FontType.Medium,
    fontSize: 32,
    color: 'white',
  },

  smallButtonContainer: {
    position: 'absolute',
    bottom: '8%',
    width: ScreenWidth,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFinish: {
    height: 50,
    width: 147,
    borderRadius: 25,
    borderColor: 'white',
    borderWidth: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  buttonContinue: {
    height: 51,
    width: 147,
    borderRadius: 25,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cornflowerBlue,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: FontType.Regular,
    color: 'white',
  },
  bigButton: {
    height: 50,
    width: 300,
    borderRadius: 25,
    backgroundColor: Colors.cornflowerBlue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '8%',
  },
  bigButtonText: {
    fontSize: 24,
    fontFamily: FontType.Regular,
    color: 'white',
  },
});
