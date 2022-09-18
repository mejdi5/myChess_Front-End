import React from 'react'
import { postGame } from '../../Redux/actions/gameActions';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { deleteInvitation } from '../../Redux/actions/invitationActions';
import {Button} from 'react-bootstrap'

function Invitations({currentGame, setCurrentGame, socket, setNotifications}) {

    const dispatch = useDispatch();
    const users = useSelector(state => state.users);
    const user = useSelector(state => state.user);
    const invitations = useSelector(state => state.invitations);
    const navigate = useNavigate()

    //Accept invitation and Post new game
    const startGame = (Id) => {
        const newGame = {_id: `${Math.random()}`, whitePlayerId: Id, blackPlayerId: user._id, isFinished: false, winner:""}
        dispatch(postGame(newGame, user._id));
        setCurrentGame(newGame);
        socket.current.emit("acceptInvitation", newGame);
        navigate(`/game/${newGame?.whitePlayerId}/${newGame?.blackPlayerId}`);
        invitations.map(i => dispatch(deleteInvitation(i._id, user._id)));
        setNotifications([]);
    }

return (
<div>
<Button 
    variant="dark"
    onClick={() => navigate(-1)}>Go back</Button>
{invitations.length === 0 
?
<p className="no_invitations display-1 opacity-50">
No invitations
</p>
:
invitations.map((inv, index) => {
    const invitator = users.find(u => u._id === inv.senderId)
    return (
    <div key={index} style={{display:'flex', justifyContent:'space-around', padding:'20px', borderBottom:'1px solid #f6f6f6', backgroundColor:'grey'}}>
        <strong style={{color:'darkgreen', marginRight:'20px'}}>{invitator?.userName} wants to start a game with you</strong>
        <Button 
        style={{marginRight:'10px', height:'35px', padding:'5px'}}
        variant="dark"
        onClick={() => startGame(invitator?._id)}
        >Accept</Button>
        <Button 
        style={{marginRight:'10px', height:'35px', padding:'5px'}}
        variant="danger"
        onClick={() => dispatch(deleteInvitation(inv._id,user?._id))}
        >Refuse</Button>
    </div>
    )}
)}
</div>
)}

export default Invitations