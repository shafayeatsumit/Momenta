import React, {Component} from 'react';
import {View, Text, Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {FontType} from '../../../helpers/theme';
import {connect} from 'react-redux';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import analytics from '@react-native-firebase/analytics';
import {removeContent, fetchContent} from '../../../redux/actions/tag';

class MiniMeditation extends Component {
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

  handleClose = () => {
    const {onScreenTagId} = this.state;
    const {dispatch} = this.props;
    this.fadeOutContent();
    dispatch(removeContent(onScreenTagId));
    dispatch(fetchContent(onScreenTagId));
    this.props.goToNextModal();
  };

  componentDidMount() {
    this.timerId = setTimeout(this.showContent, 1000);
  }

  handleContinue = () => {
    const {settings, dispatch, closeModal} = this.props;
    const {breathPerSession} = settings;
    dispatch({type: 'ADD_EXTRA_BREATH', breathCount: breathPerSession});
    closeModal();
  };

  componentWillUnmount() {
    this.timerId && clearTimeout(this.timerId);
  }

  render() {
    const {onScreenContent, onScreenTitle} = this.state;
    const {onboarding} = this.props;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.titleHolder}>
          <Animated.Text style={[styles.title, {opacity: this.titleOpacity}]}>
            {onScreenTitle}
          </Animated.Text>
        </View>
        <View style={styles.contentHolder}>
          <Animated.Text style={[styles.content, {opacity: this.titleOpacity}]}>
            {onScreenContent}
          </Animated.Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleClose}>
            <Text style={styles.finish}>Finish</Text>
          </TouchableOpacity>
          {onboarding.completed && (
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleContinue}>
              <Text style={styles.finish}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {onboarding, currentSession, settings, tagNames, tags, sets} = state;
  return {onboarding, currentSession, settings, tagNames, tags, sets};
};

export default connect(mapStateToProps)(MiniMeditation);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentHolder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontFamily: FontType.Bold,
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  title: {
    fontFamily: FontType.ExtraBold,
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
  },
  titleHolder: {
    position: 'absolute',
    top: ScreenHeight * 0.15,
    left: 0,
    width: ScreenWidth,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: ScreenWidth,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    height: 50,
    width: 140,
    // position: 'absolute',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 2,
    bottom: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishIconContainer: {
    height: 45,
    width: 100,
    position: 'absolute',
    borderRadius: 15,
    borderColor: 'white',
    borderWidth: 1,
    bottom: 30,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finish: {
    fontFamily: FontType.Regular,
    color: 'white',
    fontSize: 20,
  },
});
