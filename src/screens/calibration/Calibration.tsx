import React, { useRef, useState, useEffect } from 'react'
import { View, Text, Animated, StyleSheet, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CalibrationInfo from "../../components/ExerciseInfo";
import Result from "./Result";
import InfoModal from "../../components/Info";
import BackgroundImage from "../../components/BackgroundImage";
import BullsEye from "../../components/BullsEye";
import LottieView from 'lottie-react-native';
import CenterContainer from "../../components/CenterContainer";
import BackButton from "../../components/BackButton";
import ExerciseTitle from "../../components/ExerciseTitle";
import { FontType } from '../../helpers/theme';
import Button from "../../components/ButtonMd";
import { eventButtonPush, eventCalibrationHold, eventCalibrationRelease } from "../../helpers/analytics";

interface Props {
  primaryColor: string;
  displayName: string;
  backgroundImagePath: string;
  backgroundGradient: [string, string];
  closeModal: () => void;
  updateCalibrationData: Function;
}

enum ErrorType {
  InhaleError = "Inhale",
  ExhaleError = "Exhale",
}

enum CalibrationType {
  None,
  Inhale,
  Exhale,
  Error,
  Result,
}

interface Error {
  type: ErrorType | null;
  message: string | null;
  visible: boolean,
}

const initError = {
  type: null,
  message: null,
  visible: false,
}
const ABOUT = "This allows you to do two things:\n\nMeasure your current breathing rhythms so you can start to get a feel for how quickly or slowly you are breathing\n\nCalibrate the exercise or course to your current breathing rhythm so you get a more natural, soothing, and calming experience";
const TIPS = "Inhale and exhale through your nose normally. No need to change anything about your breath or alter it any way.\n\nYou’ll have the option to redo the calibration phase if you’d like too.\n\nYou simply want to measure your current breathing and Momenta will adjust the exercise to that breathing";

let pressInTime: Date | null = null;
let pressOutTime: Date | null = null;
let longExhaleErrorId: ReturnType<typeof setTimeout> | null = null;
let inhaleDuration: number | null = null;
let exhaleDuration: number | null = null;

const Calibration: React.FC<Props> = ({ updateCalibrationData, closeModal, primaryColor, displayName, backgroundImagePath, backgroundGradient }: Props) => {
  const animationRef = useRef<LottieView>(null)
  const [resultVisible, setResultVisible] = useState<boolean>(false);
  const [error, setError] = useState<Error>(initError);
  const [calibrationType, setCalibrationType] = useState<CalibrationType>(CalibrationType.None)
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);

  let animationTimeOutId: null | ReturnType<typeof setTimeout> = null;

  const playAnimation = () => {
    animationRef.current && animationRef.current.play();
  }

  const measureTime = (time: Date) => {
    return ((new Date() - time) / 1000).toFixed(1);
  };


  const stopAnimation = () => {
    animationRef.current && animationRef.current.reset();
    animationTimeOutId && clearTimeout(animationTimeOutId)
  }



  const handlePressIn = () => {
    eventCalibrationHold();
    const isExhaling = pressInTime !== null;
    if (pressInTime) {
      const timeTakenExhale = Number(measureTime(pressOutTime));
      longExhaleErrorId && clearTimeout(longExhaleErrorId);
      if (timeTakenExhale < 2) {
        twoSecsError('exhale');
        return;
      }
      // success;
      exhaleDuration = timeTakenExhale;
      setCalibrationType(CalibrationType.Result);
      setResultVisible(true);
      return;
    }
    animationTimeOutId = setTimeout(playAnimation, 100)
    pressInTime = new Date();
    setCalibrationType(CalibrationType.Inhale)
  }

  const handlePressOut = () => {
    eventCalibrationRelease();
    if (pressInTime && pressOutTime) {
      // calibration complete this case;
      return;
    }

    pressOutTime = new Date();
    const timeTakenInhale = Number(measureTime(pressInTime));
    setCalibrationType(CalibrationType.Exhale);
    inhaleDuration = timeTakenInhale;
    if (timeTakenInhale < 2) {
      twoSecsError('inhale');
      return;
    }
    if (timeTakenInhale > 8) {
      eightSecsError('inhale')
      return;
    }

    // check if not tapping / exhaling for more than 8 sec;
    longExhaleErrorId = setTimeout(() => eightSecsError('exhale'), 8000)
  }

  const resetCalibration = () => {
    pressInTime = null;
    pressOutTime = null;
    inhaleDuration = null;
    exhaleDuration = null;
    setError(initError);
    stopAnimation()
    setCalibrationType(CalibrationType.None);
  }

  const twoSecsError = (breathingType: string) => {
    const errType = breathingType === "inhale" ? ErrorType.InhaleError : ErrorType.ExhaleError;
    setCalibrationType(CalibrationType.Error);
    setError({
      type: errType,
      message: "must be\nat least 2 seconds long",
      visible: true,
    })

  };

  const eightSecsError = (breathingType: string) => {
    const errType = breathingType === "inhale" ? ErrorType.InhaleError : ErrorType.ExhaleError
    setCalibrationType(CalibrationType.Error);
    setError({
      type: errType,
      message: "must be\nless than 8 seconds long",
      visible: true,
    })
  };

  const handleRetry = () => {
    resetCalibration();
    eventButtonPush('retry_calibration');
  }

  const closeResult = () => {
    resetCalibration()
    setResultVisible(false);
  }

  useEffect(() => {
    return () => {
      longExhaleErrorId = null;
      pressInTime = null;
      pressOutTime = null;
      inhaleDuration = null;
      exhaleDuration = null;
    }
  }, [])

  const closeInfoModal = () => setInfoModalVisible(false);
  const handlePressInfo = () => setInfoModalVisible(true);


  const handleContinue = () => {
    setResultVisible(false);
    updateCalibrationData(inhaleDuration, exhaleDuration)
    // closeModal()
  }
  const bullsEyeVisible = calibrationType !== CalibrationType.Error && calibrationType !== CalibrationType.Result;
  const animationVisible = calibrationType === CalibrationType.Inhale || calibrationType === CalibrationType.Exhale;
  const showInhaleInstruction = calibrationType === CalibrationType.None;
  const errorVisible = calibrationType === CalibrationType.Error;
  const inhaling = calibrationType === CalibrationType.Inhale;
  const exhaling = calibrationType === CalibrationType.Exhale;
  return (
    <LinearGradient
      useAngle={true}
      angle={192}
      angleCenter={{ x: 0.5, y: 0.5 }}
      start={{ x: 0, y: 0 }} end={{ x: 0.05, y: 0.95 }}
      colors={backgroundGradient}
      style={{ flex: 1 }}

    >
      <BackButton handlePress={closeModal} />
      <ExerciseTitle title="Calibrate" />
      {animationVisible &&
        <CenterContainer>
          {inhaling && <Text allowFontScaling={false} style={styles.textBold}>Release when done inhaling</Text>}
          {exhaling && <Text allowFontScaling={false} style={styles.textBold}>Tap when done exhaling</Text>}
          <LottieView
            source={require('../../../assets/anims/measuring.json')}
            autoPlay={false}
            loop
            ref={animationRef}
            style={styles.animationFile}
            colorFilters={[
              { keypath: "Shape Layer 1", color: primaryColor },
              { keypath: "Shape Layer 2", color: primaryColor },
              { keypath: "Shape Layer 3", color: primaryColor },
              { keypath: "Shape Layer 4", color: primaryColor },
              { keypath: "Shape Layer 5", color: primaryColor },
            ]}
          />
        </CenterContainer>
      }

      {errorVisible &&
        <>
          <CenterContainer>
            <Text allowFontScaling={false} style={styles.text}><Text style={styles.highlighter}>{error.type}</Text> {error.message}</Text>
          </CenterContainer>
          <View style={styles.buttonHolder}>
            <Button handlePress={handleRetry} containerStyle={{ backgroundColor: primaryColor }} title="RETRY" />
          </View>
        </>
      }
      <CalibrationInfo handlePress={handlePressInfo} />
      <View style={styles.msgContainer}>
        {showInhaleInstruction && <Text allowFontScaling={false} style={styles.text}>Tap and hold below during your next <Text style={styles.highlighter}>inhale</Text> </Text>}
      </View>

      <BackgroundImage imagePath={backgroundImagePath} />
      {bullsEyeVisible && <BullsEye color={primaryColor} handlePressIn={handlePressIn} handlePressOut={handlePressOut} />}
      <Modal
        animationType="none"
        transparent={true}
        visible={resultVisible}
        onRequestClose={closeResult}
      >
        <Result
          inhaleDuration={inhaleDuration}
          exhaleDuration={exhaleDuration}
          handleContinue={handleContinue}
          handleRedo={closeResult}
          primaryColor={primaryColor}
        />
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={closeInfoModal}
      >
        <InfoModal
          title={displayName} about={ABOUT}
          tips={TIPS} handleClose={closeInfoModal}
        />
      </Modal>
    </LinearGradient>
  );
}

export default Calibration;

const styles = StyleSheet.create({
  animationFile: {
    height: 120,
    width: 120,
  },
  text: {
    fontFamily: FontType.Medium,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  textBold: {
    fontFamily: FontType.Medium,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  highlighter: {
    color: '#4F58CA',
    fontWeight: '800',
  },
  msgContainer: {
    height: 70,
    width: 280,
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
  },
  buttonHolder: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
  }
});
