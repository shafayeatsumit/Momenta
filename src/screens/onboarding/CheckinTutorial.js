import React, {useState, useRef, useEffect} from 'react';
import analytics from '@react-native-firebase/analytics';
import LottieView from 'lottie-react-native';
import {ScreenWidth} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import ButtonBig from '../home/ButtonBig';
import {useDispatch} from 'react-redux';

const CheckinTutorial = (props) => {
  const dispatch = useDispatch();
  const [showVideo, setVideo] = useState(false);
  const [showRewatch, setRewatch] = useState(false);
  const lottieRef = useRef(null);

  useEffect(() => {
    if (showVideo) {
      lottieRef.current.play();
    }
  }, [showVideo]);

  useEffect(() => {
    if (showRewatch) {
      lottieRef.current.play();
    }
  }, [showRewatch]);

  const animationFinish = () => {
    setRewatch(true);
  };

  const rewatchTutorial = () => {
    analytics().logEvent('rewatch_animation');
    setRewatch(false);
  };

  if (showVideo) {
    return (
      <View style={styles.main}>
        <View style={styles.topTextHolder}>
          <Text style={styles.text} allowFontScaling={false}>
            First, measure your current{' '}
            <Text style={styles.textBold} allowFontScaling={false}>
              exhale
            </Text>{' '}
            and inhale and then use the pacer to adjust your rhythm
          </Text>
        </View>
        {showRewatch ? (
          <TouchableOpacity onPress={rewatchTutorial}>
            <Image
              source={require('../../../assets/icons/rewatch.png')}
              style={styles.rewatch}
            />
          </TouchableOpacity>
        ) : (
          <LottieView
            autoSize
            autoPlay={false}
            loop={false}
            style={styles.lottieFile}
            source={require('../../../assets/anims/tutorial.json')}
            ref={(el) => {
              lottieRef.current = el;
            }}
            onAnimationFinish={animationFinish}
          />
        )}
        <View style={styles.buttonContainer}>
          <ButtonBig
            handlePress={() => {
              const {navigation} = props;
              const {handleMusic, navRoute} = props.route.params;
              dispatch({type: 'ONBOARDING_DONE'});
              navigation.replace(navRoute, {handleMusic});
              analytics().logEvent('button_push', {title: 'I am ready'});
            }}
            title="I am ready"
            buttonColor={Colors.cornflowerBlue}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.centerTextHolder}>
        <Text style={styles.text}>
          Calmer breathing {'\n'}focuses on slower, longer{' '}
          <Text style={styles.textBold}>exhales</Text>
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <ButtonBig
          handlePress={() => {
            setVideo(true);
            analytics().logEvent('button_push', {title: 'next'});
          }}
          title="Next"
          buttonColor={Colors.cornflowerBlue}
        />
      </View>
    </View>
  );
};
export default CheckinTutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewatch: {
    alignSelf: 'center',
    marginTop: 50,
    height: 200,
    width: 200,
    tintColor: 'white',
    resizeMode: 'contain',
  },
  lottieFile: {
    alignSelf: 'center',
    marginTop: 15,
    height: 300,
    width: 300,
  },
  main: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
  },
  centerTextHolder: {
    paddingHorizontal: 30,
  },
  topTextHolder: {
    marginTop: 50,
    paddingHorizontal: 30,
  },
  text: {
    fontFamily: FontType.Medium,
    fontSize: 23,
    color: 'white',
    lineHeight: 32,
  },
  textBold: {
    fontFamily: FontType.ExtraBold,
    fontSize: 24,
    color: Colors.cornflowerBlue,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 35,
    alignItems: 'center',
    width: ScreenWidth,
    height: 50,
  },
});
