import analytics from '@react-native-firebase/analytics';
import {api} from '../../helpers/api';
import AsyncStorage from '@react-native-community/async-storage';

export const anonymousSignup = () => (dispatch, getState) => {
  api
    .post('auth/anonymoussignup/')
    .then((resp) => {
      const {id} = resp.data;
      dispatch({type: 'ADD_USER_DATA', data: resp.data});
      analytics().setUserId(id.toString());
      AsyncStorage.setItem('token', resp.data.token)
        .then(() => {})
        .catch((error) => console.log('error in setting async storage', error));
    })
    .catch((error) => console.log('error in auth==>', error));
};
