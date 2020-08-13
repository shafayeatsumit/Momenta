import React, {Component} from 'react';
import {StyleSheet, Modal, View, Text, TouchableOpacity} from 'react-native';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import {FontType, Colors} from '../../helpers/theme';
import analytics from '@react-native-firebase/analytics';
import IntroHelper from './IntroExplainer';

class IntroModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      explainerVisible: true,
      helperVisible: false,
    };
  }

  handlePress = () => {
    analytics().logEvent('button_push', {title: 'Next'});
    this.setState({explainerVisible: false, helperVisible: true});
  };

  render() {
    const {explainerVisible, helperVisible} = this.state;
    return (
      <View style={styles.mainContainer}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={explainerVisible}>
          <View style={styles.mainContainer}>
            <View style={styles.hideTheBackground}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>
                  We'll start with a 3{'\n'}breath meditation that produces calm
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={this.handlePress}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal animationType="fade" transparent={true} visible={helperVisible}>
          <IntroHelper closeModal={this.props.closeModal} />
        </Modal>
      </View>
    );
  }
}
export default IntroModal;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  hideTheBackground: {
    width: ScreenWidth,
    height: '60%',
    // backgroundColor: Colors.betterBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    height: 200,
    width: 284,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  text: {
    fontFamily: FontType.Regular,
    fontSize: 24,
    color: 'white',
    textAlign: 'left',
  },
  button: {
    height: 50,
    width: 300,
    borderRadius: 25,
    backgroundColor: Colors.cornflowerBlue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: ScreenHeight * 0.2,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: FontType.Regular,
    color: 'white',
  },
  timeTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
