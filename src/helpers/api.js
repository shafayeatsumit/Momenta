import axios from 'axios';
import CamelcaseKeys from 'camelcase-keys';
import _ from 'lodash';
import {Buffer} from 'buffer';
import ReduxStore from '../redux/store';
import moment from 'moment-timezone';
const {store} = ReduxStore();
import AsyncStorage from '@react-native-community/async-storage';
// const BASEURL = 'http://localhost:8000/';

const BASEURL = 'http://backend.getmomenta.co/api/v1/';

const anonymousEndpoints = ['auth/anonymoussignup/'];

const transformResponse = (data) => {
  if (_.isObject(data)) {
    return CamelcaseKeys(data, {deep: true});
  }
  return data;
};

export const api = axios.create({
  baseURL: BASEURL,
  timeout: 20000, // = 20 seconds
  headers: {
    'Time-Zone': moment.tz.guess(),
  },
  transformResponse: [
    ...axios.defaults.transformResponse,
    (data) => transformResponse(data),
  ],
});

const errorInterceptor = async (axiosError) => {
  const {config, response} = axiosError;
  if (response.status === 401) {
    // check if token is invalid
    return Promise.reject(response.data.detail);
  }
  return Promise.reject(axiosError);
};

const authInterceptor = async (request) => {
  const isAnonymous = anonymousEndpoints.includes(request.url);
  if (isAnonymous) {
    return request;
  }
  const token = await AsyncStorage.getItem('token');
  request.headers.Authorization = `${token}`;
  return request;
};

export const imageDownloader = (image) => {
  return axios
    .get(image, {responseType: 'arraybuffer'})
    .then((response) => new Buffer(response.data, 'binary').toString('base64'))
    .catch((error) => `imageDownloader error ${error}`);
};

api.interceptors.request.use(authInterceptor);
api.interceptors.response.use((res) => res, errorInterceptor);
