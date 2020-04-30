import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  View,
  ImageBackground,
  Animated,
  Image,
  Text,
  SafeAreaView,
  PanResponder,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Content.styles';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import Swiper from 'react-native-swiper';
import DEFAULT_IMAGE from '../../../assets/default_background.png';
import bookmarkIcon from '../../../assets/icons/bookmark.png';
import downIcon from '../../../assets/icons/down.png';
import moreIcon from '../../../assets/icons/more.png';
import shareIcon from '../../../assets/icons/share.png';
import _ from 'lodash';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {api} from '../../helpers/api';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollActive: true,
      scrollIndex: 0,
    };

    this.categoryOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.iconOpacity = new Animated.Value(0);
    this.tapActive = true;
    this.swiperPanResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (event, gestureState) => {
        const x = event.nativeEvent.locationX.toFixed(2);
        const y = gestureState.y0.toFixed(2);
        const maxTappableY = ScreenHeight - ScreenHeight * 0.1;
        const halfScreenWidth = ScreenWidth / 2;
        const {contentType} = this.props;
        if (x > halfScreenWidth) {
          // right clickable area
          if (this.tapActive) {
            contentType === 'bookmarks'
              ? this.fadeOut({type: 'NEXT_BOOKMARK_CONTENT'})
              : this.fadeOut({type: 'NEXT_CONTENT'});
          }
        } else if (x < halfScreenWidth && y < maxTappableY) {
          // left clickable area
          const hasPreviousContent = this.props.allContents[
            this.props.activeIndex
          ];
          const isSetChange = this.checkSetChange();
          if (this.tapActive && !isSetChange && hasPreviousContent) {
            contentType === 'bookmarks'
              ? this.fadeOut({type: 'PREVIOUS_BOOKMARK_CONTENT'}, true)
              : this.fadeOut({type: 'PREVIOUS_CONTENT'}, true);
          }
        }
      },
    });
  }

  checkSetChange = () => {
    const {allContents, activeIndex} = this.props;
    const previousSet = _.get(allContents[activeIndex - 1], 'setId');
    const currentSet = _.get(allContents[activeIndex], 'setId');
    return previousSet !== currentSet;
  };

  checkSetChangeForward = () => {
    const {allContents, activeIndex} = this.props;
    const nextSet = _.get(allContents[activeIndex + 1], 'setId');
    const currentSet = _.get(allContents[activeIndex], 'setId');
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

  handleScroll = (index) => {
    this.setState({scrollIndex: index});
    if (index > this.state.scrollIndex) {
      this.fadeOutQucik();
    }
  };

  fadeOutQucik = () => {
    const {dispatch, contentType} = this.props;
    this.categoryOpacity.setValue(0);
    this.contentOpacity.setValue(0);
    contentType === 'bookmarks'
      ? dispatch({type: 'GO_TO_NEXT_BOOKMARK_SET'})
      : dispatch({type: 'GO_TO_NEXT_SET'});
  };

  fadeIn = (isSetChanged) => {
    this.turnOffInteraction();
    if (isSetChanged) {
      Animated.timing(this.categoryOpacity, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start();
    }
    Animated.timing(this.contentOpacity, {
      toValue: 1,
      duration: 3500,
      delay: 1500,
      useNativeDriver: true,
    }).start(this.turnOnInteraction);
  };

  fadeOut = (actionType, ingnoreSetChange = false) => {
    const {dispatch} = this.props;
    this.turnOffInteraction();
    const willSetChange = this.checkSetChangeForward();
    if (willSetChange && !ingnoreSetChange) {
      Animated.timing(this.categoryOpacity, {
        toValue: 0,
        duration: 3000,
        delay: 1000,
        useNativeDriver: true,
      }).start();
    }
    Animated.timing(this.contentOpacity, {
      toValue: 0,
      duration: 2000,
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

  normalizeResponse = (responseData) => {
    let contents = responseData.map((item) => item.contents);
    return _.flatten(contents);
  };

  fetchContent = () => {
    const url = '/api/contents/?tags=calm';
    api
      .get(url)
      .then((resp) => {
        const r = this.normalizeResponse(resp.data);
        console.log('r', r);
      })
      .catch((error) => console.log('error', error));
  };

  componentDidMount() {
    const {dispatch, activeIndex, contentType, resetContent} = this.props;
    if (resetContent) {
      this.resetContent();
      return;
    }
    if (activeIndex !== null) {
      this.categoryOpacity.setValue(1);
      this.contentOpacity.setValue(1);
      return;
    }
    // depending on the playing mode fetch data or play bookmark
    if (contentType === 'bookmarks') {
      // do nothing
      dispatch({type: 'START_BOOKMARKS'});
    } else {
      // TODO: change the name to fetch content
      this.fetchContent();
      dispatch({type: 'ADD_CONTENT'});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {activeIndex} = this.props;
    // index has changed
    if (prevProps.activeIndex !== activeIndex) {
      const isSetChanged = this.checkSetChange();
      this.fadeIn(isSetChanged);
    }
  }

  render() {
    const {allContents, activeIndex, categories, contentType} = this.props;
    const contentAvailable = allContents[activeIndex];
    const contentCategory = contentAvailable
      ? allContents[activeIndex].category
      : null;
    const contentText = contentAvailable
      ? allContents[activeIndex].content
      : null;
    // TODO: we need to remove this

    const background = DEFAULT_IMAGE;
    // contentType === 'bookmarks'
    //   ? DEFAULT_IMAGE
    //   : categories.items.find(
    //       (item) =>
    //         item.id === categories.selected[categories.selected.length - 1],
    //     ).image;

    return (
      <ImageBackground style={styles.container} source={background}>
        <SafeAreaView style={styles.contentContainer}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={this.props.closeSheet}>
              <Animated.Image source={downIcon} style={styles.iconDown} />
            </TouchableOpacity>

            <Animated.Image source={moreIcon} style={styles.iconMore} />
          </View>
          <Swiper
            showsButtons={false}
            loop={false}
            onIndexChanged={this.handleScroll}
            scrollEnabled={this.state.scrollActive}
            showsPagination={false}>
            {/** Array(4) will be replaced by content/bookmarks sets*/}
            {/** initially we will set content/bookmarks to the state */}
            {/** the moment we scroll rtl we are going to remove that set from from the set */}
            {[...Array(4).keys()].map((item, itemIndex) => (
              <View {...this.swiperPanResponder.panHandlers} key={item}>
                <View style={styles.categoryContainer}>
                  {item === this.state.scrollIndex && (
                    <Animated.Text
                      style={[
                        styles.category,
                        {opacity: this.categoryOpacity},
                      ]}>
                      {contentCategory}
                    </Animated.Text>
                  )}
                </View>
                <View style={styles.thoughtContainer}>
                  {item === this.state.scrollIndex && (
                    <Animated.Text
                      style={[styles.content, {opacity: this.contentOpacity}]}>
                      {contentText}
                    </Animated.Text>
                  )}
                </View>
              </View>
            ))}
          </Swiper>
          <View style={styles.footerContainer}>
            <Animated.Image source={shareIcon} style={styles.icon} />
            <Animated.Image source={bookmarkIcon} style={styles.bookmarkIcon} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {contents, categories, contentType, bookmarks} = state;
  const allContents =
    contentType === 'bookmarks' ? bookmarks.contents : contents.allContents;
  const activeIndex =
    contentType === 'bookmarks' ? bookmarks.activeIndex : contents.activeIndex;
  return {
    allContents,
    activeIndex,
    categories,
    contentType,
  };
};

export default connect(mapStateToProps)(Content);
