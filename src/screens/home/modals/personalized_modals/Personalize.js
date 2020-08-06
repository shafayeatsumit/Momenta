import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import Swiper from 'react-native-swiper';
import LetsStart from './LetsStart';
import PickAGoal from './PickAGoal';
import PickAnEmotion from './PickAnEmotion';
import {ScreenWidth} from '../../../../helpers/constants/common';
import {Colors} from '../../../../helpers/theme';

class Personalize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  getDotElement = () => <View style={styles.dot} />;
  getActiveDotElement = () => <View style={styles.activeDot} />;
  goNext = () => {
    this.swiperRef.scrollBy(1);
  };

  fakeLoading = () => {
    this.setState({loading: true});
    this.timeoutId = setTimeout(() => {
      clearTimeout(this.timeoutId);
      this.props.closeModal();
    }, 3000);
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <LottieView
            autoSize
            autoPlay
            loop
            source={require('../../../../../assets/anims/breath.json')}
          />
        </View>
      );
    }
    return (
      <Swiper
        showsButtons={false}
        loop={false}
        scrollEnabled={false}
        ref={(ref) => (this.swiperRef = ref)}
        dot={this.getDotElement()}
        activeDot={this.getActiveDotElement()}>
        <LetsStart goNext={this.goNext} />
        <PickAGoal goNext={this.goNext} />
        <PickAnEmotion closeModal={this.fakeLoading} />
      </Swiper>
    );
  }
}
export default Personalize;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
  activeDot: {
    backgroundColor: Colors.cornflowerBlue,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    bottom: ScreenWidth * 0.22,
  },
  dot: {
    backgroundColor: Colors.primaryLight,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    bottom: ScreenWidth * 0.22,
  },
});
