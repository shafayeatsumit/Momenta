import React, {Component} from 'react';
import {View, StyleSheet, AppState} from 'react-native';
import LottieView from 'lottie-react-native';
import analytics from '@react-native-firebase/analytics';
import {anonymousSignup} from '../redux/actions/tag';
import {connect} from 'react-redux';
import {FontType, Colors} from '../helpers/theme';

class Loading extends Component {
  navigate = () => {
    const {dispatch, navigation, onboarding} = this.props;
    navigation.navigate('Onboarding');
    // if (onboarding.completed) {
    //   // go to
    //   navigation.navigte('Home')
    // } else {
    //   // go to home
    //   // navigation.navigate('Onboarding')
    // }
  };

  componentDidMount() {
    const {userInfo, dispatch, onboarding} = this.props;
    if (!userInfo.token) {
      dispatch(anonymousSignup());
    }
    userInfo.userId && analytics().setUserId(userInfo.userId.toString());
    this.navigate();
    // onboarding.completed && this.checkTodaysFocus();
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
