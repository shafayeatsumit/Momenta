import React, {useState, useRef} from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  View,
} from 'react-native';

import {Colors, FontType} from '../../helpers/theme';
import Button from '../../components/ButtonBig';
import Swiper from 'react-native-swiper';
import {useDispatch, useSelector} from 'react-redux';
import analytics from '@react-native-firebase/analytics';

const CalibrationExplainer = ({goToCalibration, goBack}) => {
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const handleButtonPress = () => {
    if (index === 0) {
      scrollRef.current?.scrollBy(1, true);
      setIndex(1);
    } else {
      dispatch({type: 'HIDE_CALIBRATION_EXPLAINER'});
      goToCalibration();
    }
  };

  const handleXout = () => {
    analytics().logEvent('button_push', {title: 'quit'});
    goBack();
  };

  return (
    <View style={styles.slide1}>
      <Text style={styles.title}>Calibration</Text>
      <TouchableOpacity style={styles.backbuttonHolder} onPress={handleXout}>
        <Image
          source={require('../../../assets/icons/arrow_left.png')}
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
          <View style={{flex: 1, marginTop: 50}}>
            <View style={styles.textHolderBox}>
              <Text style={styles.text}>
                First, we'll measure the length of your current{' '}
                <Text style={styles.exhales}>exhale</Text> and inhale
              </Text>
            </View>

            <View style={styles.slideIndecator}>
              <View style={styles.indecatorActive} />
              <View style={styles.indecatorInactive} />
            </View>
          </View>
          <View style={{flex: 1}}>
            <View style={styles.textHolderBox}>
              <Text style={styles.text}>
                Then, we'll adjust the exercise{'\n'}to help you go from your
                {'\n'}current breathing to the target{'\n'}breathing rhythms
                naturally
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
        title="Next"
        containerStyle={styles.button}
        handlePress={handleButtonPress}
      />
    </View>
  );
};
export default CalibrationExplainer;

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
  textHolderBox: {
    height: 180,
    width: '100%',
    position: 'absolute',
    bottom: 200,
    // backgroundColor: 'red',
  },
});
