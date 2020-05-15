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
import DEFAULT_IMAGE from '../../assets/background_imges/image_4.png';
import {Svg, Defs, Rect, Mask, Circle} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SvgCircle = ({closeModal}) => {
  const radius = new Animated.Value(1);
  const [fullSceeen, setFullScreen] = useState(false);
  const expandCircle = () => {
    Animated.timing(radius, {
      toValue: 7,
      duration: 10000,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };
  const shrinkCircle = () => {
    Animated.timing(radius, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  };

  const onStateChange = ({nativeEvent}) => {
    console.log('onState Change', nativeEvent.state);
    if (fullSceeen) {
      Alert.alert(
        'Done',
        'Game Finished',
        [
          {
            text: 'Go Back',
            onPress: closeModal,
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
      return;
    }
    if (nativeEvent.state === State.BEGAN) {
      expandCircle();
    } else if (nativeEvent.state === State.END) {
      shrinkCircle();
    }
  };
  useEffect(() => {
    const animationId = radius.addListener(({value}) => {
      value === 7 && setFullScreen(true);
    });
    return () => radius.removeListener(animationId);
  }, []);

  const radiusPercent = radius.interpolate({
    inputRange: [1, 7],
    outputRange: ['10%', '70%'],
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
          fill="rgba(0, 0, 0, 0.8)"
          mask="url(#mask)"
          fill-opacity="0"
        />
      </Svg>
    </TapGestureHandler>
  );
};

const Profile = ({closeModal}) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={DEFAULT_IMAGE} style={styles.image}>
        <SvgCircle closeModal={closeModal} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
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
