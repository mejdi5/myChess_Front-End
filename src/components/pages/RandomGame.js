import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import Chessboard from "chessboardjsx";
import Chess from "chess.js";



const RandomGame = () => {

    const [chess] = useState(new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"));
    const user = useSelector(state => state.user);
    const [fen, setFen] = useState(chess.fen());


const handleMove = (move) => {
    if (chess.move(move)) {
    setTimeout(() => {
    const moves = chess.moves();
    if (moves.length > 0) {
        const computerMove = moves[Math.floor(Math.random() * moves.length)];
        chess.move(computerMove);
        setFen(chess.fen());
    }}, 300);
    setFen(chess.fen());
    }
};


return (
<div className="chessboard" style={{marginTop:'70px'}}>

    <div style={{display:'flex'}}>
        <img 
        className="opponent_picture"
        src="/images/computer.jpg"
        alt=""/>
        <h5>Computer</h5>
    </div>

    <Chessboard
        width={400}
        position={fen}
        onDrop={(move) =>
        handleMove({
            from: move.sourceSquare,
            to: move.targetSquare,
            promotion: "q",
        })
        }
    />

    <div style={{display:'flex'}}>
        <img 
        className="opponent_picture"
        src={user?.picture ? `/images/${user?.picture?.path}` : "/images/noAvatar.png"}
        alt=""/>
        <h5>{user?.userName}</h5>
    </div>
    <Link to="/">
        <Button 
        variant="danger"
        style={{width:'70px', height:'40px', marginLeft:'170px', marginTop:'30px'}}
        >Leave</Button>
    </Link>
    {
    (chess?.in_checkmate() && chess?.turn() === 'w')
    ? alert(`You lost`)
    : (chess?.in_checkmate() && chess?.turn() === 'b')
    ? alert(`You won`)
    : (chess?.in_draw())
    ? alert(`Draw`)
    : null
    }
</div>
)}  


export default RandomGame