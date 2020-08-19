import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './Onboarding.styles';

const IMPORTANT_NOTE =
  'Important: don’t change your current breathing rhythm as you measure your breath length,\n No deep or yoga breaths yet!';

class IntroVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoPlayedOnce: false,
      showImpNote: false,
    };
  }

  handleNext = () => {
    if (!this.state.showImpNote) {
      this.setState({showImpNote: true});
    } else {
      this.props.goNext();
    }
  };

  componentDidMount() {
    // TODO: need to check the actual time of the animation.
    this.timerId = setTimeout(() => {
      this.setState({videoPlayedOnce: true});
      clearTimeout(this.timerId);
    }, 10000);
  }

  render() {
    const {videoPlayedOnce, showImpNote} = this.state;
    return (
      <View style={styles.introVideoContainer}>
        {showImpNote ? (
          <View>
            <Text style={styles.introVideoText}>{IMPORTANT_NOTE}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.introVideoText}>
              This is how you measure your breath length time
            </Text>
            <LottieView
              autoSize
              autoPlay
              loop
              style={styles.introVideo}
              source={require('../../../assets/anims/intro_video.json')}
            />
          </>
        )}
        {videoPlayedOnce && (
          <TouchableOpacity style={styles.button} onPress={this.handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
export default IntroVideo;
