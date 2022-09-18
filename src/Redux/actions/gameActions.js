import {GET_ONE_GAME, GET_GAMES} from './ActionTypes'
import { Axios } from '../../axios'; 

//get games of one user
export const getGames = (userId) => (dispatch) => {
    Axios
    .get(`/api/games/${userId}`)
    .then((res) => dispatch({ type: GET_GAMES, payload: res.data.games }))
    .catch((err) => console.log(err));
};

//Get one game
export const getOneGame = gameId => (dispatch) => {
    Axios
    .get(`/api/games/game/${gameId}`)
    .then((res) => dispatch({ type: GET_ONE_GAME, payload: res.data }))
    .catch((err) => console.log(err));
};

//post new game
export const postGame = (newGame, userId) => (dispatch) => {
    Axios
    .post(`/api/games`, newGame)
    .then((res) => dispatch(getGames(userId)))
    .catch((err) => console.log(err));
};

//edit game
export const editGame = (userId, gameId, editedGame) => (dispatch) => {
    Axios
    .put(`/api/games/edit-game/${gameId}`, editedGame)
    .then((res) => dispatch(getGames(userId)))
    .catch((err) => console.log(err));
};



