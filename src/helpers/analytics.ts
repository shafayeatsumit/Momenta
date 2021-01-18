import analytics from '@react-native-firebase/analytics';

export const eventButtonPush = (title: string) => {
  analytics().logEvent('button_push', { title });
}

export const eventCalibrationHold = () => {
  analytics().logEvent('calibration_hold');
}

export const eventCalibrationRelease = () => {
  analytics().logEvent('calibration_release');
}

export const eventSetUserId = (id: string) => {
  analytics().setUserId(id);
}