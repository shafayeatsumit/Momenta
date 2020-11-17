import React, {useState, useRef} from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
} from 'react-native';

import {Colors, FontType} from '../helpers/theme';
import Button from '../components/ButtonBig';
import Swiper from 'react-native-swiper';
import {useDispatch, useSelector} from 'react-redux';
import analytics from '@react-native-firebase/analytics';

const ExerciseExplainer = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const breathing = useSelector((state) => state.breathing);
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const handleButtonPress = () => {
    if (index === 0) {
      scrollRef.current?.scrollBy(1, true);
      setIndex(1);
    } else {
      dispatch({type: 'HIDE_EXERCISE_EXPLAINER'});
      breathing.type === 'fixed'
        ? navigation.replace('FixedBreathing')
        : navigation.replace('GuidedBreathing');
    }
  };
  const handleXout = () => {
    navigation.goBack();
    analytics().logEvent('button_push', {title: 'quit'});
  };

  const buttonTitle = index === 0 ? 'NEXT' : "I'M READY";
  return (
    <View style={styles.slide1}>
      <TouchableOpacity style={styles.backbuttonHolder} onPress={handleXout}>
        <Image
          source={require('../../assets/icons/arrow_left.png')}
          style={styles.backbutton}
        />
      </TouchableOpacity>
      <View style={{flex: 1}} />

      <View style={{flex: 2}}>
        <Swiper
          style={{}}
          showsButtons={false}
          ref={scrollRef}
          showsPagination={false}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={styles.textHolderBox}>
              <Text allowFontScaling={false} style={[styles.text]}>
                Focus on your{' '}
                <Text allowFontScaling={false} style={styles.exhales}>
                  exhales
                </Text>
              </Text>
            </View>

            <View style={styles.slideIndecator}>
              <View style={styles.indecatorActive} />
              <View style={styles.indecatorInactive} />
            </View>
          </View>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={styles.textHolderBox}>
              <Text allowFontScaling={false} style={styles.text}>
                The sign of good, calm{'\n'}breathing is long, slow, easy{'\n'}
                <Text allowFontScaling={false} style={styles.exhales}>
                  exhaling
                </Text>
              </Text>
            </View>
            <View style={styles.slideIndecator}>
              <View style={styles.indecatorInactive} />
              <View style={styles.indecatorActive} />
            </View>
          </View>
        </Swiper>
      </View>

      <Button
        title={buttonTitle}
        containerStyle={styles.button}
        handlePress={handleButtonPress}
      />
    </View>
  );
};
export default ExerciseExplainer;

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    backgroundColor: Colors.betterBlue,
  },
  exhales: {
    color: Colors.buttonBlue,
  },
  title: {
    fontFamily: FontType.Medium,
    fontSize: 16,
    color: 'white',
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
  },
  backbuttonHolder: {
    position: 'absolute',
    top: 30,
    alignItems: 'center',
    height: 45,
    width: 45,
    zIndex: 10,
  },
  backbutton: {
    height: 18,
    width: 18,
    tintColor: 'white',
  },
  textHolderBox: {
    height: 180,
    width: '100%',
    position: 'absolute',
    bottom: 200,
  },
  text: {
    paddingHorizontal: 25,
    fontFamily: FontType.Medium,
    color: 'white',
    fontSize: 20,
    lineHeight: 25,
  },
  slideIndecator: {
    height: 20,
    width: 33,
    left: 40,
    position: 'absolute',
    bottom: 130,
    justifyContent: 'space-between',
    flexDirection: 'row',
    // backgroundColor: 'yellow',
  },
  indecatorInactive: {
    height: 4,
    width: 4,
    borderRadius: 2,
    backgroundColor: '#666D94',
  },
  indecatorActive: {
    height: 4,
    width: 20,
    borderRadius: 3,
    backgroundColor: Colors.buttonBlue,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    borderRadius: 6,
    alignSelf: 'center',
  },
});
