import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    GET_AUTH_USER,
    AUTH_ERRORS,
    GET_USERS,
    GET_GAMES, 
    GET_ONE_GAME,
    GET_INVITATIONS,
} from '../actions/ActionTypes';

const initialState = {
    token: localStorage.getItem('x-auth-token'), 
    user: null, 
    isAuth: false,
    msg: null,
    users: [], 
    games: [],
    invitations: [],
    game: null
};

const Reducer = (state = initialState, { type, payload }) => {
    
    switch (type) {
        
        case REGISTER_USER:
        case LOGIN_USER:
        localStorage.setItem('x-auth-token', payload.token);
        return {
            ...state,
            isAuth: true,
            ...payload,
        };

        case GET_AUTH_USER:
        return {
            ...state,
            isAuth: true,
            ...payload,
        };

        case AUTH_ERRORS:
        case LOGOUT_USER:
        localStorage.removeItem('x-auth-token');
        return {
            ...state,
            token: null,
            isAuth: false,
            user: null,
        };

        case GET_USERS:
        return {
        ...state,
        users: payload
        };

        case GET_GAMES:
        return {
        ...state,
        games: payload
        };

        case GET_ONE_GAME:
        return {
        ...state,
        game: payload
        };

        case GET_INVITATIONS:
        return {
        ...state,
        invitations: payload
        };

        default:
        return state;
    }
};

export default Reducer;