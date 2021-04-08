import axios from 'axios';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';


// const BASEURL = 'http://ec2-3-137-161-26.us-east-2.compute.amazonaws.com:3000/'
// const BASEURL = 'http://localhost:3000/';
const BASEURL = 'http://production.getmomenta.co/'

// AsyncStorage.clear();

const anonymousEndpoints = [
  'auth/local/register',
  'exercises',
  'courses',
  'challenges',  
  'guided-practices',
];

export const api = axios.create({
  baseURL: BASEURL,
  timeout: 20000, // = 20 seconds
});


const authInterceptor = async (request) => {
  const isAnonymous = anonymousEndpoints.includes(request.url);
  if (isAnonymous) {    
    return request;
  }
  const token = await AsyncStorage.getItem('token');  
  request.headers.Authorization = `Bearer ${token}`;
  return request;
};


api.interceptors.request.use(authInterceptor);

