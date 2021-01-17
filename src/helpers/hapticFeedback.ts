import { Platform } from "react-native";
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const hapticFeedbackOptions = {
  enableVibrateFallback: false,
  ignoreAndroidSystemSettings: true,
};

export const triggerHaptic = () => {
  const feedbackType = Platform.OS === 'ios' ? 'selection' : 'keyboardPress';
  ReactNativeHapticFeedback.trigger(feedbackType, hapticFeedbackOptions);
}


