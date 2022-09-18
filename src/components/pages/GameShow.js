import React,{useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import  Chess from 'chess.js'
import Chessboard from 'chessboardjsx'



function GameShow() {

    const users = useSelector(state => state.users);
    const user = useSelector(state => state.user);
    const game = useSelector(state => state.game);
    const navigate = useNavigate()
    let [chess] = useState(new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"));
    const [fen, setFen] = useState(chess.fen());
    const [moveNumber, setMoveNumber] = useState(1);

    const opponent = users && users
    .filter(u => u._id !== user?._id)
    .find(u => u._id === game?.whitePlayerId || u._id === game?.blackPlayerId)

    const seeMoves = () => {
        if (moveNumber <= game.history.length) {
            setMoveNumber(moveNumber + 1)
            for (let i = 0; i < moveNumber; i++) {
                chess.move(game.history[i]); 
            }
        }
        setFen(chess.fen());
    }

return (
<div>
    <Button 
    variant="dark"
    onClick={() => navigate(-1)}>Go back</Button>

<div className="chessboard" style={{height:'500px', marginTop:'50px', marginLeft:'50%'}}>

    <div style={{display:'flex', marginLeft:'67px'}}>
        <img 
        className="opponent_picture"
        src={opponent?.picture ? `/images/${opponent?.picture?.path}` : "/images/noAvatar.png"}
        alt=""/>
        <h5>{opponent?.userName}</h5>
    </div>

    <Chessboard 
    orientation={user?._id === game?.whitePlayerId ? 'white' : 'black'}
    position={fen}
    draggable={false}
    />

    <div style={{display:'flex', justifyContent:'space-around'}}>
    <div style={{display:'flex'}}>
        <img 
        className="opponent_picture"
        src={user?.picture ? `/images/${user?.picture?.path}` : "/images/noAvatar.png"}
        alt=""/>
        <h5>{user?.userName}</h5>
    </div>
    <Button 
    onClick={seeMoves}
    style={{width:'70px', height:'40px'}}
    >Next</Button>
    </div>

</div>
</div>
)}

export default GameShow