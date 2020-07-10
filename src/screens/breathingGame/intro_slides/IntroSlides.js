import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import {useDispatch} from 'react-redux';
import Swiper from 'react-native-swiper';

const ExplainerModal = ({closeExplainer}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.modal}>
        <Swiper showsButtons={false} loop={false} dotColor={'#7882b4'}>
          <View style={styles.slide}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                Each calm breath has {'\n'} two steps
              </Text>
            </View>
          </View>
          <View style={styles.slide}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                First, tap and hold the screen while you gently inhale to fully
                reveal a calming image
              </Text>
            </View>
          </View>
          <View style={styles.slide}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                Then release the screen to exhale and complete one calm breath
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={closeExplainer}>
                <View style={styles.timeTextContainer}>
                  <Text style={styles.timeText}>Ok got it</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Swiper>
      </View>
    </View>
  );
};

export default ExplainerModal;

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(27,31,55,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: ScreenWidth * 0.9,
    height: 400,
    borderRadius: 10,
    backgroundColor: '#1b1f37',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#787989',
    overflow: 'hidden',
  },
  slide: {
    flexGrow: 1,
  },
  text: {
    fontFamily: FontType.SemiBold,
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 30,
  },
  smallText: {
    fontFamily: FontType.Regular,
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    paddingTop: 20,
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  button: {
    height: 60,
    width: ScreenWidth * 0.75,
    borderRadius: 5,
    backgroundColor: '#3c71de',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timeText: {
    fontFamily: FontType.Medium,
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    lineHeight: 30,
  },
  timeTextSmall: {
    fontFamily: FontType.Medium,
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    lineHeight: 27,
    marginLeft: 1,
  },
});
