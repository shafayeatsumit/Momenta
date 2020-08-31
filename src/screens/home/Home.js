import React, {Component} from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import styles from './Home.styles';
import GuidedBreathing from './GuidedBreathingTypes';
import BreathCounter from './BreathCounter';
import FixedBreathing from './FixedBreathing';
class Home extends Component {
  switchTab = () => this.props.dispatch({type: 'SWITCH_BREATHING_TYPE'});
  handleStart = () => {
    const {breathing, navigation} = this.props;
    breathing.type === 'fixed'
      ? navigation.navigate('Home')
      : navigation.navigate('GuidedBreathing');
  };
  render() {
    const {breathing} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              onPress={this.switchTab}
              style={[
                styles.tab,
                breathing.type === 'guided' && styles.tabHighlight,
              ]}>
              <Text style={styles.tabText}>Guided</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.switchTab}
              style={[
                styles.tab,
                breathing.type === 'fixed' && styles.tabHighlight,
              ]}>
              <Text style={styles.tabText}>Fixed</Text>
            </TouchableOpacity>
          </View>
          {breathing.type === 'guided' ? (
            <GuidedBreathing />
          ) : (
            <FixedBreathing />
          )}

          <BreathCounter />
        </View>
        <TouchableOpacity style={styles.startButton} onPress={this.handleStart}>
          <Text style={styles.startText}>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    breathing: state.breathing,
  };
};

export default connect(mapStateToProps)(Home);
