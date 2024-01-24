import * as ActionTypes from './ActionTypes'
import { configureStore} from '@reduxjs/toolkit'
import axios from 'axios';
import BASE_URL from '../shared/baseURL';

const initialState = {
  users: [],
  loggedInUser: null,
}

const reducer = (state = initialState, action) => { 
  switch (action.type) {
    case ActionTypes.REGISTER:
      axios.post(`${BASE_URL}/api/users/register`, 
        {
          email: `${action.payload.email}`, 
          password: `${action.payload.pass}`,
          fname: `${action.payload.fname}`,
          lname: `${action.payload.lname}`,
          type: "Unapproved"
        }).then((response) => {
          console.log(response);
        }, (error) => {
          console.log(error);
        });

        axios
        .post(`${BASE_URL}/chat/register`, { email:action.payload.email, first_name:action.payload.fname, last_name:action.payload.lname })
        .then((r) => console.log(r)) 
        .catch((e) => console.log(JSON.stringify(e.response.data)));
      return {
        ...state,
        users: [...state.users, action.payload],
      }

    case ActionTypes.LOGIN:
      return {
        ...state,
        loggedInUser: action.payload,
      }

    case ActionTypes.CHANGE_PASSWORD:
      axios.patch(`${BASE_URL}/api/users/update/password`, 
        {
          email: `${action.payload.email}`, 
          password: `${action.payload.pass}`
        }).then((response) => {
          console.log(response);
        }, (error) => {
          console.log(error);
        });
      return {
        ...state,
        loggedInUser: action.payload,
      }

    default:
      return state;
  }
}

export default configureStore({reducer})