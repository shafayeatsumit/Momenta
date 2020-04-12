import React, {Component, useEffect, useState, useReducer, useRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  View,
  ImageBackground,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Text,
  PanResponder,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Content.styles';
import {
  addContent,
  nextContent,
  previousContent,
  goToNextSet,
} from '../../redux/actions/contents';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import Swiper from 'react-native-swiper';
import {useSelector, useDispatch} from 'react-redux';
import _ from 'lodash';
const BG =
  'https://images.unsplash.com/photo-1581090824720-3c9f822192dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollActive: true,
      scrollIndex: 1,
    };
    this.categoryOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.tapActive = true;
    this.swiperPanResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
    });

    this.tapPanResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (event, gestureState) => {
        const x = event.nativeEvent.locationX.toFixed(2);
        const leftTapArea = ScreenWidth / 2;
        const SWIPE_THRESHOLD = 0.25 * ScreenWidth;
        console.log('swiped left', gestureState.dx);
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          console.log('swiped left');
        }
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
    console.log('scroll index', index);
    this.setState({scrollIndex: index});
    this.fadeOutQucik({type: 'GO_TO_NEXT_SET'});
  };

  handleScrollEnd = (e, state, context) => {
    console.log('state', state);
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
    const {dispatch} = this.props;
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
          <View style={styles.topRow} />
          <Swiper
            style={styles.bottomRow}
            showsButtons={false}
            loop={true}
            onIndexChanged={this.handleScroll}
            scrollEnabled={this.state.scrollActive}
            onResponderRelease={this.handleScrollEnd}
            showsPagination={false}>
            {[...Array(2).keys()].map((item, itemIndex) => (
              <View {...this.swiperPanResponder.panHandlers} key={item}>
                <View style={styles.categoryContainer}>
                  <Animated.Text
                    style={[styles.category, {opacity: this.categoryOpacity}]}>
                    {contentCategory}
                  </Animated.Text>
                </View>
                <View
                  style={styles.thoughtContainer}
                  {...this.tapPanResponder.panHandlers}>
                  <Animated.Text
                    style={[styles.content, {opacity: this.contentOpacity}]}>
                    {contentText}
                  </Animated.Text>
                </View>
                <View style={styles.footerContainer} />
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
