import React, {Component} from 'react';
import {View, StyleSheet, AppState} from 'react-native';
import LottieView from 'lottie-react-native';
import analytics from '@react-native-firebase/analytics';
import {anonymousSignup} from '../redux/actions/tag';
import {connect} from 'react-redux';
import {FontType, Colors} from '../helpers/theme';

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    };
  }
  navigate = () => {
    const {navigation, onboarding} = this.props;
    onboarding.completed
      ? navigation.replace('CheckIn')
      : navigation.navigate('Onboarding');
  };

  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.navigate();
    }
    this.setState({appState: nextAppState});
  };

  componentDidMount() {
    const {userInfo, dispatch} = this.props;
    if (!userInfo.token) {
      dispatch(anonymousSignup());
    }
    userInfo.userId && analytics().setUserId(userInfo.userId.toString());
    this.navigate();
  }

  render() {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          autoSize
          autoPlay
          loop
          source={require('../../assets/anims/hourglass.json')}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {userInfo, onboarding} = state;
  return {
    userInfo,
    onboarding,
  };
};

export default connect(mapStateToProps)(Loading);
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.betterBlue,
  },
});
