import React, { useRef, useState } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundImage from "../../components/BackgroundImage";
import BullsEye from "../../components/BullsEye";
import LottieView from 'lottie-react-native';
import CenterContainer from "../../components/CenterContainer";
import BackButton from "../../components/BackButton";

interface Props {
  navigation: any;
  route: RouteProp<any, any>;
}

const Calibration: React.FC<Props> = ({ navigation, route }: Props) => {
  const { primaryColor, displayName, backgroundImagePath, backgroundGradient } = route.params.exercise;
  const animationRef = useRef<LottieView>(null)
  const [showAnimation, setShowAnimation] = useState<boolean>(false);

  let animationTimeOutId: null | ReturnType<typeof setTimeout> = null;

  const playAnimation = () => {
    animationRef.current && animationRef.current.play();
  }

  const handlePressIn = () => {
    animationTimeOutId = setTimeout(playAnimation, 100)

    setShowAnimation(true);
  }

  const handlePressOut = () => {
    setShowAnimation(false);
    animationRef.current && animationRef.current.reset();
    animationTimeOutId && clearTimeout(animationTimeOutId)
  }
  const handleBack = () => navigation.goBack();


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
      {showAnimation &&
        <CenterContainer>
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

      <BackgroundImage imagePath={backgroundImagePath} />
      <BullsEye color={primaryColor} handlePressIn={handlePressIn} handlePressOut={handlePressOut} />
    </LinearGradient>
  );
}

export default Calibration;

const styles = StyleSheet.create({
  animationFile: {
    height: 120,
    width: 120,
  }
});
