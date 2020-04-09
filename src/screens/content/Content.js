import React, {useEffect, useState, useReducer, useRef} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ImageBackground,
  Animated,
  Text,
  PanResponder,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Content.styles';
import AllContents from '../../helpers/constants/tempdata';

const THOUGHT = 'Notice how you \nfeel compared to \nbefore.';
const BG =
  'https://images.unsplash.com/photo-1581090824720-3c9f822192dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80';

function reducer(state, action) {
  let updatedIndex, rewindCount;
  switch (action.type) {
    case 'ADD_CONTENT':
      updatedIndex = state.activeIndex === null ? 0 : state.activeIndex;
      return {
        ...state,
        allContents: [...state.allContents, ...AllContents],
        activeIndex: updatedIndex,
      };
    case 'GO_NEXT':
      updatedIndex = state.activeIndex === null ? 0 : state.activeIndex + 1;
      rewindCount = rewindCount !== 0 ? 0 : state.rewindCount;
      return {
        ...state,
        activeIndex: updatedIndex,
        rewindCount,
      };
    case 'GO_BACK':
      rewindCount = rewindCount + 1;
      updatedIndex = state.activeIndex ? state.activeIndex - 1 : 0;

      return {
        ...state,
        activeIndex: updatedIndex,
        rewindCount,
      };
    default:
      return state;
  }
}

const Content = (props) => {
  const [categoryOpacity] = useState(new Animated.Value(0));
  const [contentOpacity] = useState(new Animated.Value(0));
  const [{allContents, activeIndex, rewindCount}, dispatch] = useReducer(
    reducer,
    {
      allContents: [],
      activeIndex: null,
      rewindCount: 0,
    },
  );

  // setting up pan responder
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log('panrespnder grant');
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: (event, gestureState) => {
        console.log('gstate', gestureState);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  const fadeInAnim = () => {
    Animated.parallel([
      Animated.timing(categoryOpacity, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 3500,
        delay: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const fadeOut = (type) => {
    const stopGoingBack =
      (type === 'GO_BACK' && rewindCount >= 3) ||
      (type === 'GO_BACK' && activeIndex === 0);
    if (stopGoingBack) {
      return;
    }
    Animated.parallel([
      Animated.timing(categoryOpacity, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 3500,
        delay: 1500,
        useNativeDriver: true,
      }),
    ]).start(() => dispatch({type}));
  };

  useEffect(() => {
    fadeInAnim();
  }, [activeIndex]);
  useEffect(() => {
    dispatch({type: 'ADD_CONTENT'});
  }, []);
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
        colors={['rgba(27,31,55,0.57)', 'rgba(27,31,56,1)', 'rgba(27,31,56,1)']}
        style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Animated.Text style={[styles.category, {opacity: categoryOpacity}]}>
            {contentCategory}
          </Animated.Text>
        </View>
        <View style={styles.middleRow} {...panResponder.panHandlers}>
          <Animated.Text style={[styles.content, {opacity: contentOpacity}]}>
            {contentText}
          </Animated.Text>
          <View
            onStartShouldSetResponder={() => fadeOut('GO_BACK')}
            style={styles.leftTouchable}
          />
          <View
            style={styles.rightTouchable}
            onStartShouldSetResponder={() => fadeOut('GO_NEXT')}
          />
        </View>
        <View style={styles.bottomRow} />
      </LinearGradient>
    </ImageBackground>
  );
};
export default Content;
