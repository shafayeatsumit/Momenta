import React, { useRef, useState, useEffect } from 'react'
import { View, Text, Animated, StyleSheet, Modal } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Result from "./Result";
import BackgroundImage from "../../components/BackgroundImage";
import BullsEye from "../../components/BullsEye";
import LottieView from 'lottie-react-native';
import CenterContainer from "../../components/CenterContainer";
import BackButton from "../../components/BackButton";
import ExerciseTitle from "../../components/ExerciseTitle";
import { FontType } from '../../helpers/theme';
import Button from "../../components/ButtonMd";

interface Props {
  navigation: any;
  route: RouteProp<any, any>;
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

let pressInTime: Date | null = null;
let pressOutTime: Date | null = null;
let longExhaleErrorId: ReturnType<typeof setTimeout> | null = null;
let inhaleDuration: number | null = null;
let exhaleDuration: number | null = null;

const Calibration: React.FC<Props> = ({ navigation, route }: Props) => {
  const { primaryColor, displayName, backgroundImagePath, backgroundGradient } = route.params.exercise;
  const animationRef = useRef<LottieView>(null)
  const [resultVisible, setResultVisible] = useState<boolean>(false);
  const [error, setError] = useState<Error>(initError);
  const [calibrationType, setCalibrationType] = useState<CalibrationType>(CalibrationType.None)
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
    if (pressInTime && pressOutTime) {
      // calibration complete this case;
      return;
    }

    pressOutTime = new Date();
    const timeTakenInhale = Number(measureTime(pressInTime));
    setCalibrationType(CalibrationType.Exhale);
    inhaleDuration = timeTakenInhale;
    console.log("Inhale time ====>", timeTakenInhale);
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

  const handleBack = () => navigation.goBack();
  const handleContinue = () => {
    console.log(`result inhale ${inhaleDuration} exhale ${exhaleDuration}`)
    setResultVisible(false);
    setTimeout(handleBack, 300);
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
      <BackButton handlePress={handleBack} />
      <ExerciseTitle title="Calibrate" />
      {animationVisible &&
        <CenterContainer>
          {inhaling && <Text style={styles.textBold}>Release when done inhaling</Text>}
          {exhaling && <Text style={styles.textBold}>Tap when done exhaling</Text>}
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
            <Text style={styles.text}><Text style={styles.highlighter}>{error.type}</Text> {error.message}</Text>
          </CenterContainer>
          <View style={styles.buttonHolder}>
            <Button handlePress={resetCalibration} containerStyle={{ backgroundColor: '#4F58CA' }} title="RETRY" />
          </View>
        </>
      }

      <View style={styles.msgContainer}>
        {showInhaleInstruction && <Text style={styles.text}>Tap and hold below during your next <Text style={styles.highlighter}>inhale</Text> </Text>}
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
