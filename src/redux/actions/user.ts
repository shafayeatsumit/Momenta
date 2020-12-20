import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from './types';
const url = 'https://jsonplaceholder.typicode.com/users';

interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface Company {
  name: string;
  catchPhrase: string,
  bs: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

// this describes the action object that dispatch receives.
export interface FetchUsersAction {
  type: ActionTypes.fetchUsers;
  payload: User[];
}

export interface DeleteUserAction {
  type: ActionTypes.deleteUser;
  payload: number;
}

export const fetchUser = () => {
  return {
    type: ActionTypes.fetchUsers,
  }
};

export const fetchUsers = (): FetchUsersAction => {
  return {
    type: ActionTypes.fetchUsers,
    payload: [],
  }
}

export const deleteTodo = (id: number): DeleteUserAction => {
  return {
    type: ActionTypes.deleteUser,
    payload: id,
  };
};