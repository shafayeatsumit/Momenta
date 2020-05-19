import React, {useState, useEffect} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Easing,
  Text,
  Alert,
  ImageBackground,
} from 'react-native';
import {
  TapGestureHandler,
  State,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {colors, FontType} from '../helpers/theme';
import {ScreenHeight, ScreenWidth} from '../helpers/constants/common';
import {RFValue} from '../helpers/responsiveFont';

import DEFAULT_IMAGE from '../../assets/background_imges/image_4.png';
import {Svg, Defs, Rect, Mask, Circle} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SvgCircle = ({closeModal}) => {
  const radius = new Animated.Value(1);
  const [fullSceeen, setFullScreen] = useState(false);
  const expandCircle = () => {
    const currentRadius = radius._value;
    const duration = 8000 - 8000 / (7 - currentRadius);
    Animated.timing(radius, {
      toValue: 7,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };
  const shrinkCircle = () => {
    const currentRadius = radius._value;
    const duration = 8000 - 8000 / (currentRadius - 1);
    Animated.timing(radius, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  const onStateChange = ({nativeEvent}) => {
    console.log('onState Change', nativeEvent.state);
    if (fullSceeen) {
      console.log('fullscreen');
      closeModal();
      return;
    }
    if (nativeEvent.state === State.BEGAN) {
      expandCircle();
    } else if (nativeEvent.state === State.END) {
      shrinkCircle();
    }
  };
  useEffect(() => {
    radius.addListener(({value}) => {
      // console.log('value', value);
      if (value === 7) {
        setFullScreen(true);
        closeModal();
      }
    });
  }, [radius]);

  const radiusPercent = radius.interpolate({
    inputRange: [1, 7],
    outputRange: ['10%', '70%'],
    extrapolate: 'clamp',
  });

  return (
    <TapGestureHandler onHandlerStateChange={onStateChange}>
      <Svg height="100%" width="100%">
        <Defs>
          <Mask id="mask" x="0" y="0" height="100%" width="100%">
            <Rect height="100%" width="100%" fill="#fff" />
            <AnimatedCircle
              r={fullSceeen ? '100%' : radiusPercent}
              cx="50%"
              cy="50%"
              stroke="red"
              strokeWidth="1"
              fill="black"
            />
          </Mask>
        </Defs>
        <Rect
          height="100%"
          width="100%"
          fill="rgba(0, 0, 0,0.95)"
          mask="url(#mask)"
          fill-opacity="0"
        />
      </Svg>
    </TapGestureHandler>
  );
};

const Profile = ({closeModal, contentTag}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.category}>{contentTag}</Text>
      <SvgCircle closeModal={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  category: {
    position: 'absolute',
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: RFValue(24),
    top: ScreenHeight * 0.25,
    left: 20,
    zIndex: 4,
  },

  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: 'grey',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
export default Profile;
