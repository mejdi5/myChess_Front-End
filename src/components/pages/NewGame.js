import React,{useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { editGame } from '../../Redux/actions/gameActions';
import {Button} from 'react-bootstrap'
import Chessboard from 'chessboardjsx'
import { useNavigate } from 'react-router-dom';



function NewGame({currentGame, setCurrentGame, chess, socket, opponent, handleMove, fen, setFen}) {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user);
    const navigate = useNavigate()

    //disable chessboard in opponent's turn
    const Draggable = () => {
        if (user?._id === currentGame?.whitePlayerId) {
            if(chess?.turn() === 'w') {
                return true
            } else {
                return false
            }
        }
        if (user?._id === currentGame?.blackPlayerId) {
            if(chess?.turn() === 'b') {
                return true
            } else {
                return false
            }
        }
    }

    //game result
    useEffect(() => {
    if (currentGame && chess?.in_checkmate() && ((chess?.turn() === 'w' && user._id === currentGame?.whitePlayerId) || (chess?.turn() === 'b' && user._id === currentGame?.blackPlayerId))) {
        dispatch(editGame(user._id, currentGame._id,{
            _id: currentGame?._id,
            whitePlayerId: currentGame?.whitePlayerId,
            blackPlayerId: currentGame?.blackPlayerId,
            isFinished: true,
            winner: opponent._id,
            history: chess?.history({ verbose: true })
        }))
        setCurrentGame(null)
        setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
        navigate('/')
    }  
    if (currentGame && chess?.in_checkmate() && ((chess?.turn() === 'w' && opponent._id === currentGame?.whitePlayerId) || (chess?.turn() === 'b' && opponent._id === currentGame?.blackPlayerId))) {
        dispatch(editGame(user._id, currentGame._id,{
            _id: currentGame?._id,
            whitePlayerId: currentGame?.whitePlayerId,
            blackPlayerId: currentGame?.blackPlayerId,
            isFinished: true,
            winner: user._id,
            history: chess?.history({ verbose: true })
        }))
        setCurrentGame(null)
        setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
        navigate('/')
    }  
    if (currentGame && chess?.in_draw()) {
        dispatch(editGame(user._id, currentGame._id,{
            _id: currentGame?._id,
            whitePlayerId: currentGame?.whitePlayerId,
            blackPlayerId: currentGame?.blackPlayerId,
            isFinished: true,
            winner: "Draw",
            history: chess?.history({ verbose: true })
        }))
        setCurrentGame(null)
        setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
        navigate('/')
    }
    }, [currentGame, chess, socket])
    

    //when current user resigns
    const resign = () => {
    dispatch(editGame(user?._id, currentGame?._id, {
        _id: currentGame?._id,
        whitePlayerId: currentGame?.whitePlayerId,
        blackPlayerId: currentGame?.blackPlayerId,
        isFinished: true,
        winner: opponent?._id,
        history: chess?.history({ verbose: true })
    }));
    socket.current.emit("resign", {
        _id: currentGame._id,
        opponentId: opponent?._id,
    });
    alert(`${opponent?.userName} won by resign`)
    setCurrentGame(null);
    setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    navigate('/')
    }

return (
<div className="chessboard">

    {
    (currentGame && chess?.in_checkmate() && ((chess?.turn() === 'w' && user._id === currentGame?.whitePlayerId) || (chess?.turn() === 'b' && user._id === currentGame?.blackPlayerId)))
    ? alert(`${opponent?.userName} won`)
    : (currentGame && chess?.in_checkmate() && ((chess?.turn() === 'w' && opponent._id === currentGame?.whitePlayerId) || (chess?.turn() === 'b' && opponent._id === currentGame?.blackPlayerId)))
    ? alert(`${user?.userName} won`)
    : (currentGame && chess?.in_draw())
    ? alert(`Draw`)
    : null
    }
    
    <div style={{display:'flex', marginLeft:'67px'}}>
        <img 
        className="opponent_picture"
        src={opponent?.picture ? `/images/${opponent?.picture?.path}` : "/images/noAvatar.png"}
        alt=""/>
        <h5>{opponent?.userName}</h5>
    </div>

    <Chessboard 
    orientation={user?._id === currentGame?.whitePlayerId ? 'white' : 'black'}
    position={fen}
    draggable={Draggable()}
    onDrop={(move) =>
        handleMove({
            from: move.sourceSquare,
            to: move.targetSquare,
            promotion: "q",
        })}
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
    onClick={resign}
    variant="dark"
    style={{width:'70px', height:'40px'}}
    >Resign</Button>
    </div>
</div>
)}

export default NewGame