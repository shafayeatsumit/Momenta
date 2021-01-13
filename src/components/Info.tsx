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

const InfoModal: React.FC<Props> = ({ about, tips, title, handleClose }) => {
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
      <Text style={styles.settings}>{title}</Text>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>About</Text>
        <Text style={styles.text}>{about}</Text>
        <Text style={styles.title}>Tips</Text>
        <Text style={styles.text}>{tips}</Text>
      </ScrollView>
      <View style={styles.spacerBottom} />
      <View style={styles.closeButton}>
        <ModalButton handlePress={handleClose} >
          <Text style={styles.buttonText}>DONE</Text>
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
