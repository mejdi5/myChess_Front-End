import {
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  GET_AUTH_USER,
  AUTH_ERRORS,
  GET_USERS, 
} from './ActionTypes';
import { Axios } from '../../axios';


// Register User
export const registerUser = (formData) => async (dispatch) => {
  try {
    const res = await Axios.post('/api/users/register', formData);
    dispatch({
      type: REGISTER_USER,
      payload: res.data, 
    });
  } catch (error) {
    console.dir(error);

    const { errors, msg } = error.response.data;

    if (Array.isArray(errors)) {
      errors.forEach((err) => alert(err.msg));
    }
    console.log(errors);
    if (msg) {
      alert(msg);
    }

    dispatch({
      type: AUTH_ERRORS,
    });
  }
};

// Login User
export const loginUser = (formData) => async (dispatch) => {

  try {
    const res = await Axios.post('/api/users/login', formData);
    dispatch({
      type: LOGIN_USER,
      payload: res.data, 
    });
  } catch (error) {
    console.dir(error);

    const { errors, msg } = error.response.data;

    if (Array.isArray(errors)) {
      errors.forEach((err) => alert(err.msg));
    }
    console.log(errors);
    if (msg) {
      alert(msg);
    }

    dispatch({
      type: AUTH_ERRORS,
    });
  }
};

// Get auth user
export const getAuthUser = () => async (dispatch) => {

  try {
    //headers
    const config = {
      headers: {
        'x-auth-token': localStorage.getItem('x-auth-token'),
      },
    };
    const res = await Axios.get('/api/users/authUser', config);
    dispatch({
      type: GET_AUTH_USER,
      payload: res.data, 
    });
  } catch (error) {
    console.log(error.message);
    dispatch({
      type: AUTH_ERRORS,
    });
  }
};

//logout
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT_USER,
  });
};

//Get all users
export const getAllUsers = () => (dispatch) => {
    Axios
    .get("/api/users/allUsers")
    .then((res) => dispatch({ type: GET_USERS, payload: res.data }))
    .catch((err) => console.log(err));
};

//Delete a user
export const deleteUser = (idUser) => (dispatch) => {
    Axios
    .delete(`/api/users/delete/${idUser}`)
    .then((res) => dispatch(getAllUsers()))
    .catch((err) => console.log(err));
};

//Update a user
export const editUser = (id, editedUser) => async (dispatch) => {
  try {
    const res = await Axios.put(`/api/users/update/${id}`, editedUser )
    dispatch(getAllUsers());
  } catch (error) {
    console.dir(error);
      const { errors, msg } = error.response.data;
      if (Array.isArray(errors)) {
        errors.forEach((err) => alert(err.msg));
      }
      console.log(errors);
      if (msg) {
        alert(msg);
      }
      dispatch({
        type: AUTH_ERRORS,
      });
  }
};

