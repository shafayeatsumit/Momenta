import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontType } from '../helpers/theme';
import ModalButton from "../components/ModalButton";

interface Props {
  title: string;
  about: string;
  tips: string;
  handleClose: () => void;
}

const jsonEscape = (str: string) => {
  return str.replace(/\\n/g, '\n');
}

const ABOUT_1 = "This exercise works best when you inhale and exhale through your nose only. Your nose slows your breathing down, which in turn calms you.\n\nThe other goal is to shift your breath’s balance away from being dominated by your inhale so you can do that by first focusing on just your exhales. Then, try to consciously take less and less air in (so less volume) with each inhale.at\n\nDo not take big “deep” inhales as if you’re exercising or doing yoga. Big inhales work against the goal of balance and calm. Big breaths with lots of air, signal to your body that you’re about to move (or are possibly in danger).\n\nAfter you get going, you’ll know you’re in a good rhythm when each breath feels just a bit more gentle, balanced, and smaller than the one that preceded it"

const InfoModal: React.FC<Props> = ({ about, tips, title, handleClose }) => {
  console.log('about ===>', about);
  console.log('tips ====>', tips);
  return (
    <LinearGradient
      useAngle={true}
      angle={192}
      angleCenter={{ x: 0.5, y: 0.5 }}
      start={{ x: 0, y: 0 }} end={{ x: 0.94, y: 0.6 }}
      colors={['#353B47', '#0A120B']}
      style={{ flex: 1 }}
    >
      <View style={styles.spacer} />
      <Text allowFontScaling={false} style={styles.settings}>{title}</Text>

      <ScrollView style={styles.scrollView}>
        <Text allowFontScaling={false} style={styles.title}>About</Text>
        <Text allowFontScaling={false} style={styles.text}>{jsonEscape(about)}</Text>
        <Text allowFontScaling={false} style={styles.title}>Tips</Text>
        <Text allowFontScaling={false} style={styles.text}>{jsonEscape(tips)}</Text>
      </ScrollView>
      <View style={styles.spacerBottom} />
      <View style={styles.closeButton}>
        <ModalButton handlePress={handleClose} >
          <Text allowFontScaling={false} style={styles.buttonText}>DONE</Text>
        </ModalButton>
      </View>

    </LinearGradient>

  );
}

export default InfoModal;

const styles = StyleSheet.create({
  spacer: {
    height: 40,
  },
  spacerBottom: {
    height: 80,
  },
  settings: {
    fontSize: 25,
    color: 'white',
    alignSelf: 'center',
    fontFamily: FontType.Bold,
  },
  title: {
    fontSize: 25,
    color: 'white',
    textAlign: 'left',
    fontFamily: FontType.Bold,
    marginVertical: 20,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
    color: 'white',
    // alignSelf: 'center',
    fontFamily: FontType.Regular,
  },
  closeButton: {
    position: 'absolute',
    height: 50,
    width: 80,
    bottom: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#979797',
    fontFamily: FontType.Medium,
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 30,
    marginVertical: 15,
  }

});
