import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Text,
  Animated,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {connect} from 'react-redux';
import {fetchTags, anonymousSignup} from '../../redux/actions/tag';
import BrethingGame from '../breathingGame/BreathingGame';
import styles from './Home.styles';
import {ScreenWidth, ScreenHeight} from '../../helpers/constants/common';
import analytics from '@react-native-firebase/analytics';
import Swiper from 'react-native-swiper';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breathingGameVisible: true,
    };

    this.tagOpacity = new Animated.Value(0);
    this.contentOpacity = new Animated.Value(0);
    this.iconOpacity = new Animated.Value(0);
    this.modalTimer = null;
    this.imageSwitchTimer = null;
  }

  fadeIn = () => {
    Animated.timing(this.tagOpacity, {
      toValue: 1,
      duration: 2500,
      delay: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.contentOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 0,
      useNativeDriver: true,
    }).start(this.contentSeen);
  };

  fadeOut = () => {
    this.tagOpacity.setValue(0);
    this.contentOpacity.setValue(0);
  };

  closeBreathingGame = () => {
    this.setState({breathingGameVisible: false});
    this.modalTimer = setTimeout(() => {
      this.setState({breathingGameVisible: true});
      clearTimeout(this.modalTimer);
    }, 1000);
    this.imageSwitchTimer = setTimeout(() => {
      this.props.dispatch({type: 'REMOVE_BACKGROUND'});
      clearTimeout(this.imageSwitchTimer);
    }, 2000);
  };

  componentDidMount() {
    const {loginInfo, dispatch, sets} = this.props;
    const hasSets = Object.keys(sets).length;
    if (!loginInfo.token) {
      dispatch(anonymousSignup());
    } else {
      !hasSets && dispatch(fetchTags());
    }
    loginInfo.userId && analytics().setUserId(loginInfo.userId.toString());
  }
  componentWillUnmount() {
    this.slideTimerId && clearTimeout(this.slideTimerId);
  }

  render() {
    const {backgrounds, tags, sets} = this.props;
    const {breathingGameVisible} = this.state;
    const backgroundImageOne = backgrounds[0];
    if (!backgroundImageOne) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(120,121,137)" />
        </View>
      );
    }
    return (
      <ImageBackground style={styles.container} source={backgroundImageOne}>
        <Modal
          visible={breathingGameVisible}
          transparent={true}
          animationType="fade">
          <View
            style={{
              height: ScreenHeight,
              width: ScreenWidth,
              ...StyleSheet.absoluteFillObject,
            }}>
            <BrethingGame closeBreathingGame={this.closeBreathingGame} />
          </View>
        </Modal>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {sets, tags, selectedTags, backgrounds, onScreen, loginInfo} = state;
  return {sets, tags, selectedTags, backgrounds, onScreen, loginInfo};
};

export default connect(mapStateToProps)(Home);
