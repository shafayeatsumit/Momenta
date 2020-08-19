import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {FontType, Colors} from '../../helpers/theme';
import {ScreenHeight, ScreenWidth} from '../../helpers/constants/common';
import CommonStyles from './Onboarding.styles';

const FIRST_NOTE =
  'Your current mood, energy, and overall health are all influenced by your breathing rhythm\n\nThe lower the rhythm the better and Momenta makes that easy';

const SECOND_NOTE =
  'Now let’s measure a few breaths in a row and Momenta will then help you slow down your breathing to a very calming rhythm';

class ImpNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstNote: true,
      secondNote: false,
      note: FIRST_NOTE,
    };
  }

  handleNext = () => {
    const {secondNote} = this.state;
    if (secondNote) {
      this.props.goNext();
      return;
    }
    this.setState({secondNote: true, firstNote: false, note: SECOND_NOTE});
  };

  render() {
    const {note} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.notesContainer}>
          <Text style={styles.noteText}>{note}</Text>
        </View>
        <View style={CommonStyles.buttonContainer}>
          <TouchableOpacity
            style={CommonStyles.button}
            onPressIn={this.handleNext}>
            <Text style={CommonStyles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default ImpNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notesContainer: {
    marginHorizontal: 20,
    position: 'absolute',
    bottom: '35%',
  },
  noteText: {
    fontFamily: FontType.SemiBold,
    color: 'white',
    fontSize: 26,
    textAlign: 'left',
    padding: 20,
  },
});
