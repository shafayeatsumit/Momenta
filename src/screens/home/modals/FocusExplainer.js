import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {ScreenHeight, ScreenWidth} from '../../../helpers/constants/common';
import {FontType} from '../../../helpers/theme';
import {useDispatch} from 'react-redux';
import Swiper from 'react-native-swiper';

class FocusExplainer extends Component {
  render() {
    const {closeModal} = this.props;
    return (
      <View style={styles.mainContainer}>
        <View style={styles.modal}>
          <View>
            <Text style={styles.text}>
              Each day has a calm breathing focus.
              {'\n'}
              These are based on yoga practices and the latest science and help
              you find your own calm breathing rhythm so you make it a habit
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={closeModal}>
            <View style={styles.timeTextContainer}>
              <Text style={styles.timeText}>Ok got it</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default FocusExplainer;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1b1f37',
  },
  modal: {
    width: ScreenWidth * 0.9,
    height: 500,
    borderRadius: 10,
    backgroundColor: '#1b1f37',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#787989',
    overflow: 'hidden',
  },
  slide: {
    // flexGrow: 1,
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 22,
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

  buttonContainer: {
    width: '100%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  button: {
    height: 60,
    width: 200,
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
