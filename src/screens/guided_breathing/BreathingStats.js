import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import styles from './BreathingStats.styles';

class BreathingStats extends Component {
  render() {
    const {inhaleTime, exhaleTime, checkin, totalBreaths} = this.props;
    const endtotal = (inhaleTime + exhaleTime).toFixed(1);
    const endPerBreath = endtotal / totalBreaths;
    const endRythm = Math.ceil(60 / endPerBreath);

    const startTotal = (checkin.inhaleTime + checkin.exhaleTime).toFixed(1);
    console.log('checkin val+++', checkin);
    const startRythm = Math.ceil(60 / startTotal);

    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <View style={styles.timeContainer}>
            <View>
              <Text style={styles.buttonText}>Total</Text>
              <Text style={styles.smallText}>Breaths</Text>
            </View>
            <Text style={styles.buttonText}>{totalBreaths}</Text>
          </View>
          <View style={styles.timeContainer}>
            <View>
              <Text style={styles.buttonText}>Starting Rythm</Text>
              <Text style={styles.smallText}>breaths per minute</Text>
            </View>

            <Text style={styles.buttonText}>{startRythm}</Text>
          </View>

          <View style={styles.timeContainer}>
            <View>
              <Text style={styles.buttonText}>Ending rhythm</Text>
              <Text style={styles.smallText}>breaths per minute</Text>
            </View>

            <Text style={styles.buttonText}>{endRythm}</Text>
          </View>
        </View>

        <View style={styles.smallButtonContainer}>
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
export default BreathingStats;
