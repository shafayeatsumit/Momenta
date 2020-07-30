import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import LetsStart from './LetsStart';
import PickAGoal from './PickAGoal';
import PickANumber from './PickANumber';
import PickAnEmotion from './PickAnEmotion';
import {ScreenWidth} from '../../../../helpers/constants/common';
import {Colors} from '../../../../helpers/theme';

class Personalize extends Component {
  constructor(props) {
    super(props);
  }
  getDotElement = () => <View style={styles.dot} />;
  getActiveDotElement = () => <View style={styles.activeDot} />;
  goNext = () => {
    this.swiperRef.scrollBy(1);
  };

  render() {
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
        <PickANumber goNext={this.goNext} />
        <PickAnEmotion closeModal={this.props.closeModal} />
      </Swiper>
    );
  }
}
export default Personalize;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
