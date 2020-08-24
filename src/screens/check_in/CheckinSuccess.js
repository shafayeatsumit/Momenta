import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import styles from './CheckIn.styles';

class CheckinSuccess extends Component {
  render() {
    const {inhaleTime, exhaleTime} = this.props;
    const total = (inhaleTime + exhaleTime).toFixed(1);

    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.buttonText}>Inhale</Text>
            <Text style={styles.buttonText}>{inhaleTime.toFixed(2)} s</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.buttonText}>Exhale</Text>
            <Text style={styles.buttonText}>{exhaleTime.toFixed(2)} s</Text>
          </View>

          <View style={styles.timeContainer}>
            <Text style={styles.buttonText}>Total</Text>
            <Text style={styles.buttonText}>{total} s</Text>
          </View>
        </View>

        <View style={styles.smallButtonContainer}>
          <TouchableOpacity
            style={styles.redoButton}
            onPress={this.props.redoBreathing}>
            <Text style={styles.buttonText}>Redo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.finishButton}
            onPress={this.props.goNext}>
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default CheckinSuccess;
