import React from 'react';
import {
  View,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import styles from './Content.styles';
import Animated from 'react-native-reanimated';
import RNPickerSelect from 'react-native-picker-select';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
const {width, height} = Dimensions.get('window');
import {hapticFeedbackOptions} from '../../helpers/constants/common';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const ANDROID_HAPTICS = [
  {label: 'selection', item: 'selection', value: 'selection'},
  {label: 'impactLight', item: 'impactLight', value: 'impactLight'},
  {label: 'impactMedium', item: 'impactMedium', value: 'impactMedium'},
  {label: 'impactHeavy', item: 'impactHeavy', value: 'impactHeavy'},
  {
    label: 'notificationSuccess',
    item: 'notificationSuccess',
    value: 'notificationSuccess',
  },
  {
    label: 'notificationWarning',
    item: 'notificationWarning',
    value: 'notificationWarning',
  },
  {
    label: 'notificationError',
    item: 'notificationError',
    value: 'notificationError',
  },
  {label: 'clockTick', item: 'clockTick', value: 'clockTick'},
  {label: 'contextClick', item: 'contextClick', value: 'contextClick'},
  {label: 'keyboardPress', item: 'keyboardPress', value: 'keyboardPress'},
  {label: 'keyboardRelease', item: 'keyboardRelease', value: 'keyboardRelease'},
  {label: 'keyboardTap', item: 'keyboardTap', value: 'keyboardTap'},
  {label: 'longPress', item: 'longPress', value: 'longPress'},
  {label: 'textHandleMove', item: 'textHandleMove', value: 'textHandleMove'},
  {label: 'virtualKey', item: 'virtualKey', value: 'virtualKey'},
  {
    label: 'virtualKeyRelease',
    item: 'virtualKeyRelease',
    value: 'virtualKeyRelease',
  },
];

const IOS_HAPTICS = [
  {label: 'selection', item: 'selection', value: 'selection'},
  {label: 'impactLight', item: 'impactLight', value: 'impactLight'},
  {label: 'impactMedium', item: 'impactMedium', value: 'impactMedium'},
  {label: 'impactHeavy', item: 'impactHeavy', value: 'impactHeavy'},
  {
    label: 'notificationSuccess',
    item: 'notificationSuccess',
    value: 'notificationSuccess',
  },
  {
    label: 'notificationWarning',
    item: 'notificationWarning',
    value: 'notificationWarning',
  },
  {
    label: 'notificationError',
    item: 'notificationError',
    value: 'notificationError',
  },
];

export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startVibration: 'selection',
      endVibration: 'selection',
      contVibration: 'selection',
      duration: '10',
      spacingVal: '30',
      randomVal: '1',
    };
  }

  loopHapticFeedback = () => {
    const feedbackType = this.state.contVibration;
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
  };

  handlePressIn = () => {
    const {spacingVal, duration, randomVal} = this.state;
    if (
      Number.isNaN(Number(spacingVal)) ||
      Number.isNaN(Number(randomVal)) ||
      Number.isNaN(Number(duration)) ||
      Number(randomVal) > 1
    ) {
      Alert.alert('sorry', 'invalid input');
      return;
    }

    this.timerTwo = setTimeout(() => {
      this.contId && clearInterval(this.contId);
      ReactNativeHapticFeedback.trigger(
        this.state.endVibration,
        hapticFeedbackOptions,
      );
    }, Number(duration) * 1000);

    const feedbackType = this.state.startVibration;
    ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
    this.contId = setInterval(() => {
      const d = Math.random();
      if (d < Number(randomVal)) {
        this.loopHapticFeedback();
      }
    }, Number(spacingVal));
  };

  handlePressOut = () => {
    this.contId && clearInterval(this.contId);
    this.timerTwo && clearTimeout(this.timerTwo);
  };
  onChangeText = (type, val) => {
    this.setState({[type]: val});
  };

  render() {
    return (
      <View style={styles.main}>
        <View style={styles.firstHalf}>
          <Text style={styles.title}>Start Vibration (default selection)</Text>
          <RNPickerSelect
            onValueChange={(value) => this.setState({startVibration: value})}
            placeholder={{}}
            style={{
              inputIOS: styles.pickerPlaceHolder,
              inputAndroid: styles.pickerPlaceHolder,
            }}
            value={this.state.startVibration}
            items={Platform.OS === 'ios' ? IOS_HAPTICS : ANDROID_HAPTICS}
            useNativeAndroidPickerStyle={false}
          />
          <Text style={styles.title}>End Vibration (default selection)</Text>
          <RNPickerSelect
            onValueChange={(value) => this.setState({endVibration: value})}
            placeholder={{}}
            style={{
              inputIOS: styles.pickerPlaceHolder,
              inputAndroid: styles.pickerPlaceHolder,
            }}
            value={this.state.endVibration}
            items={Platform.OS === 'ios' ? IOS_HAPTICS : ANDROID_HAPTICS}
            useNativeAndroidPickerStyle={false}
          />
          <View style={styles.spacer} />
          <Text style={styles.title}>
            Continuous Vibration (default selection)
          </Text>
          <RNPickerSelect
            onValueChange={(value) => this.setState({contVibration: value})}
            placeholder={{}}
            style={{
              inputIOS: styles.pickerPlaceHolder,
              inputAndroid: styles.pickerPlaceHolder,
            }}
            value={this.state.contVibration}
            items={Platform.OS === 'ios' ? IOS_HAPTICS : ANDROID_HAPTICS}
            useNativeAndroidPickerStyle={false}
          />
          <View style={styles.spacer} />
          <Text style={styles.title}>
            duration in seconds (default 10 secs)
          </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.onChangeText('duration', text)}
            value={this.state.duration}
          />

          <View style={styles.spacer} />
          <Text style={styles.title}>Spacing in miliseconds (default 30)</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.onChangeText('spacingVal', text)}
            value={this.state.spacingVal}
          />
          <View style={styles.spacer} />
          <Text style={styles.title}>Randomness Vibration range (0-1) </Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.onChangeText('randomVal', text)}
            value={this.state.randomVal}
          />
        </View>

        <View style={styles.halfScreen}>
          <TouchableOpacity
            style={styles.roundButton}
            onPressIn={this.handlePressIn}
            onPressOut={this.handlePressOut}>
            <Text style={styles.buttonText}>Long Press Button</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
