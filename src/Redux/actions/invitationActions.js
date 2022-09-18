import {GET_INVITATIONS} from './ActionTypes'
import { Axios } from '../../axios';

//get invitations received by one user
export const getInvitations = (userId) => (dispatch) => {
    Axios
    .get(`/api/invitations/${userId}`)
    .then((res) => dispatch({ type: GET_INVITATIONS, payload: res.data }))
    .catch((err) => console.log(err));
};

//post new invitation
export const postInvitation = (newInvitation, userId) => (dispatch) => {
    Axios
    .post(`/api/invitations`, newInvitation)
    .then((res) => dispatch(getInvitations(userId)))
    .catch((err) => console.log(err));
};

//Delete an invitation
export const deleteInvitation = (invitationId, userId) => (dispatch) => {
    Axios
    .delete(`/api/invitations/delete/${invitationId}`)
    .then((res) => dispatch(getInvitations(userId)))
    .catch((err) => console.log(err));
};