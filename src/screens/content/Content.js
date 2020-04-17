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
import ProgressCircle from '../../components/ProgressCircle';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Content.styles';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import Swiper from 'react-native-swiper';
import bookmarkIcon from '../../../assets/icons/bookmark.png';
import downIcon from '../../../assets/icons/down.png';
import moreIcon from '../../../assets/icons/more.png';
import shareIcon from '../../../assets/icons/share.png';
import _ from 'lodash';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getProgress} from '../../helpers/common';

import {AnimatedCircularProgress} from 'react-native-circular-progress';

// import DefaultBackground from '../../../assets/default_background.png';
import DefaultBackground from '../../../assets/background_two.png';
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollActive: true,
      scrollIndex: 0,
      progressIndex: 0,
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
        const leftTapArea = ScreenWidth / 2;
        if (x > leftTapArea) {
          // right clickable area
          if (this.tapActive) {
            this.fadeOut({type: 'NEXT_CONTENT'});
          }
        } else if (x < leftTapArea && y < maxTappableY) {
          // left clickable area
          const hasPreviousContent = this.props.allContents[
            this.props.activeIndex
          ];
          const isSetChange = this.checkSetChange();
          if (this.tapActive && !isSetChange && hasPreviousContent) {
            this.fadeOut({type: 'PREVIOUS_CONTENT'});
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
      this.fadeOutQucik({type: 'GO_TO_NEXT_SET'});
    }
  };

  fadeOutQucik = (actionType) => {
    const {dispatch} = this.props;
    this.categoryOpacity.setValue(0);
    this.contentOpacity.setValue(0);
    dispatch({type: 'GO_TO_NEXT_SET'});
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

  fadeOut = (actionType) => {
    const {dispatch} = this.props;

    this.turnOffInteraction();
    const willSetChange = this.checkSetChangeForward();
    if (willSetChange) {
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
      this.setState({progressIndex: this.state.progressIndex + 1});
      dispatch(actionType);
      if (willSetChange) {
        // TODO: remove that later
        setTimeout(() => this.setState({progressIndex: 0}), 1600);
      }
    });
  };

  componentDidMount() {
    const {dispatch, activeIndex} = this.props;
    if (activeIndex !== null) {
      this.categoryOpacity.setValue(1);
      this.contentOpacity.setValue(1);
      return;
    }
    dispatch({type: 'ADD_CONTENT'});
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
    const {allContents, activeIndex, categories} = this.props;
    const progressObject = getProgress(activeIndex, allContents);
    const progress = progressObject
      ? (this.state.progressIndex / progressObject.totalInTheSet) * 100
      : 0;
    const contentAvailable = allContents[activeIndex];
    const contentCategory = contentAvailable
      ? allContents[activeIndex].category
      : null;
    const contentText = contentAvailable
      ? allContents[activeIndex].content
      : null;
    const background = categories.items.find(
      (item) => item.id === categories.selected[categories.selected.length - 1],
    ).image;
    // console.log('baccc', categories.selected[categories.selected.length - 1]);
    return (
      <ImageBackground style={styles.container} source={background}>
        <SafeAreaView style={styles.contentContainer}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={this.props.closeSheet}>
              <Animated.Image source={downIcon} style={styles.iconDown} />
            </TouchableOpacity>
            {this.state.progressIndex ? (
              <AnimatedCircularProgress
                size={45}
                width={3}
                fill={progress}
                rotation={0}
                duration={2000}
                tintColor="white"
                backgroundColor="rgba(255, 255, 255, 0.2)">
                {progressObject
                  ? (fill) => (
                      <Text style={styles.progressText}>
                        {this.state.progressIndex}/
                        {progressObject.totalInTheSet}
                      </Text>
                    )
                  : null}
              </AnimatedCircularProgress>
            ) : null}

            <Animated.Image source={moreIcon} style={styles.iconMore} />
          </View>
          <Swiper
            showsButtons={false}
            loop={false}
            onIndexChanged={this.handleScroll}
            scrollEnabled={this.state.scrollActive}
            showsPagination={false}>
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
  const {contents, categories} = state;
  const {allContents, activeIndex} = contents;

  return {
    allContents,
    activeIndex,
    categories,
  };
};

export default connect(mapStateToProps)(Content);
