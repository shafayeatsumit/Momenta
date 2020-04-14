import React, {Component, useEffect, useState, useReducer, useRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  View,
  ImageBackground,
  ScrollView,
  Animated,
  Image,
  TouchableWithoutFeedback,
  Text,
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
import {RFValue} from '../../helpers/responsiveFont';
import _ from 'lodash';
import {TouchableOpacity} from 'react-native-gesture-handler';
const BG =
  'https://images.unsplash.com/photo-1581090824720-3c9f822192dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';

const ICON_SIZE = RFValue(30);
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollActive: true,
      scrollIndex: 0,
    };

    this.categoryOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
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

    this.tapPanResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (event, gestureState) => {
        const x = event.nativeEvent.locationX.toFixed(2);
        const leftTapArea = ScreenWidth / 2;
        if (x > leftTapArea) {
          // right click
          if (this.tapActive) {
            console.log('click right++');
            this.fadeOut({type: 'NEXT_CONTENT'});
          }
        } else {
          // left click
          if (this.tapActive) {
            console.log('click left++');
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
        useNativeDriver: true,
      }).start();
    }
    Animated.timing(this.contentOpacity, {
      toValue: 0,
      duration: 3500,
      delay: 1500,
      useNativeDriver: true,
    }).start(() => {
      dispatch(actionType);
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
    const {allContents, activeIndex} = this.props;
    const contentAvailable = allContents[activeIndex];
    const contentCategory = contentAvailable
      ? allContents[activeIndex].category
      : null;
    const contentText = contentAvailable
      ? allContents[activeIndex].content
      : null;
    return (
      <ImageBackground style={styles.container} source={{uri: BG}}>
        <LinearGradient
          colors={[
            'rgba(27,31,55,0.57)',
            'rgba(27,31,56,1)',
            'rgba(27,31,56,1)',
          ]}
          style={styles.contentContainer}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={this.props.closeSheet}>
              <Image source={downIcon} style={styles.iconDown} />
            </TouchableOpacity>
            <ProgressCircle
              allContents={allContents}
              activeIndex={activeIndex}
            />
            <Image source={moreIcon} style={styles.iconMore} />
          </View>
          <Swiper
            style={styles.bottomRow}
            showsButtons={false}
            loop={false}
            onIndexChanged={this.handleScroll}
            scrollEnabled={this.state.scrollEnabled}
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
                <View style={styles.footerContainer}>
                  <Image source={shareIcon} style={styles.icon} />
                  <Image source={bookmarkIcon} style={styles.bookmarkIcon} />
                </View>
              </View>
            ))}
          </Swiper>
        </LinearGradient>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {contents} = state;
  const {allContents, activeIndex} = contents;
  return {
    allContents,
    activeIndex,
  };
};

export default connect(mapStateToProps)(Content);
