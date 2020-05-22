import axios from 'axios';
import CamelcaseKeys from 'camelcase-keys';
import _ from 'lodash';
import ReduxStore from '../redux/store';
const {store} = ReduxStore();

// const BASEURL = 'http://localhost:8000/';
// const BASEURL = 'https://threethought.herokuapp.com/';
const BASEURL = 'http://ec2-52-15-117-190.us-east-2.compute.amazonaws.com/';

const anonymousEndpoints = ['api/auth/anonymoussignup/'];

const transformResponse = (data) => {
  if (_.isObject(data)) {
    return CamelcaseKeys(data, {deep: true});
  }
  return data;
};

export const api = axios.create({
  baseURL: BASEURL,
  timeout: 20000, // = 20 seconds
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
  const {loginInfo} = await store.getState();
  request.headers.Authorization = `${loginInfo.token}`;
  return request;
};

api.interceptors.request.use(authInterceptor);
api.interceptors.response.use((res) => res, errorInterceptor);
