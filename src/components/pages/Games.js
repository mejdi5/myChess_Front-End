import React,{useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getGames, getOneGame } from '../../Redux/actions/gameActions';
import {Form, Card, FormGroup, Button} from 'react-bootstrap'
import {useNavigate, Link} from 'react-router-dom'

function Games() {

    const dispatch = useDispatch()
    const users = useSelector(state => state.users);
    const user = useSelector(state => state.user);
    const games = useSelector(state => state.games);
    const [filterByResult, setFilterByResult] = useState('All')
    const [filterByOpponent, setFilterByOpponent] = useState('All')
    const navigate = useNavigate()

    let finishedGames = games && games.filter(game => game.isFinished)
    let wonGames = finishedGames && finishedGames.filter(game => game.winner === user?._id)
    let lostGames = finishedGames && finishedGames.filter(game => game.winner !== user?._id && game.winner !== "")
    let drawnGames = finishedGames && finishedGames.filter(game => game.winner === "Draw")

    useEffect(() => 
    //get games of current user
    user && dispatch(getGames(user?._id))
    , [user]);

    const opponentIds = [...new Set(finishedGames
    .map(game => (game.whitePlayerId || game.blackPlayerId) ))]
    .filter(id => id !== user._id)

    
if(filterByOpponent !== 'All') {
    finishedGames = finishedGames.filter(game => game.whitePlayerId === filterByOpponent || game.blackPlayerId === filterByOpponent)
}


if (finishedGames && finishedGames.length === 0) {
    return (
        <div className="no_games display-1 opacity-50">
            No games
        </div>
    )
}

return (
<div className='games'>
    <Button 
    variant="dark"
    onClick={() => navigate(-1)}>Go back</Button>
    <Form style={{display:'flex', justifyContent:'space-around'}}>
    <FormGroup>
    <Form.Label><strong>Result filter</strong></Form.Label>
    <select onChange={e => setFilterByResult(e.target.value)}>
        <option>All</option>
        <option>Won</option>
        <option>Lost</option>
        <option>Draw</option>
    </select>
    </FormGroup>
    <FormGroup>
    <Form.Label><strong>Opponents filter</strong></Form.Label>
    <select onChange={e => setFilterByOpponent(e.target.value)}>
        <option>All</option>
        {opponentIds && opponentIds.map((opponentId, index) => {
            let opponent = users && users
            .find(u => u._id === opponentId)
            return (
            <option 
            key={index} 
            value={opponent?._id}
            >{opponent?.userName}</option>
        )})}
        
    </select>
    </FormGroup>
    </Form>

    {filterByResult === "All"
    ? finishedGames.map((game, index) => {
        let opponent = users && users
        .filter(u => u._id !== user?._id)
        .find(u => u._id === game.whitePlayerId || u._id === game.blackPlayerId)
    return (
    <Card key={index} style={{marginBottom:'20px'}}>
        <Card.Header style={{display:'flex', justifyContent:'space-between'}}>
            <strong>{opponent?.userName}</strong>
            <img 
            variant="top" 
            src={opponent?.picture ? `/images/${opponent.picture.path}` : "/images/noAvatar.png"}
            crossOrigin='anonymous' 
            className='user_picture'
            />
        </Card.Header>
        <Card.Body style={{textAlign:'center'}}>
            {game?.winner === user?._id 
            ? <Card.Title>Winner<br></br> {user?.userName}<br></br>
                <img 
                src='/images/win.png' 
                alt=""
                style={{width:'20px', height:'20px'}}
                /><br></br>
                <Link to={`/game/${game._id}`}><Button onClick={() => dispatch(getOneGame(game?._id))}>See Game</Button></Link>
            </Card.Title>
            : game?.winner === "Draw" 
            ? <Card.Title>Draw<br></br>
                <img 
                src='/images/draw.jpg' 
                alt=""
                style={{width:'20px', height:'20px'}}
                /><br></br>
                <Link to={`/game/${game._id}`}><Button onClick={() => dispatch(getOneGame(game?._id))}>See Game</Button></Link>
            </Card.Title>
            : <Card.Title>Winner<br></br> {opponent?.userName}<br></br>
                <img 
                src='/images/lose.png' 
                alt=""
                style={{width:'20px', height:'20px'}}
                /><br></br>
                <Link to={`/game/${game._id}`}><Button onClick={() => dispatch(getOneGame(game?._id))}>See Game</Button></Link>
            </Card.Title>
            }
        </Card.Body>
    </Card>
    )})
    : filterByResult === "Won"
    ? wonGames.map((game, index) => {
        let opponent = users && users
        .filter(u => u._id !== user._id)
        .find(u => u._id === game.whitePlayerId || u._id === game.blackPlayerId)
    return (
    <Card key={index} style={{marginBottom:'20px'}}>
        <Card.Header style={{display:'flex', justifyContent:'space-between'}}>
            <strong>{opponent?.userName}</strong>
            <img 
            variant="top" 
            src={opponent?.picture ? `/images/${opponent.picture.path}` : "/images/noAvatar.png"}
            crossOrigin='anonymous' 
            className='user_picture'
            />
        </Card.Header>
        <Card.Body style={{textAlign:'center'}}>
            <Card.Title>Winner <br></br>{user?.userName}<br></br>
                <img 
                src='/images/win.png' 
                alt=""
                style={{width:'20px', height:'20px'}}
                /><br></br>
                <Link to={`/game/${game._id}`}><Button onClick={() => dispatch(getOneGame(game?._id))}>See Game</Button></Link>
            </Card.Title>
        </Card.Body>
    </Card>
    )})
    : filterByResult === "Lost"
    ? lostGames.map((game, index) => {
        let opponent = users.find(u => u._id === game.winner)
    return (
    <Card key={index} style={{marginBottom:'20px'}}>
        <Card.Header style={{display:'flex', justifyContent:'space-between'}}>
            <strong>{opponent?.userName}</strong>
            <img 
            variant="top" 
            src={opponent?.picture ? `/images/${opponent.picture.path}` : "/images/noAvatar.png"}
            crossOrigin='anonymous' 
            className='user_picture'
            />
        </Card.Header>
        <Card.Body style={{textAlign:'center'}}>
            <Card.Title>Winner<br></br> {opponent?.userName}<br></br>
                <img 
                src='/images/lose.png' 
                alt=""
                style={{width:'20px', height:'20px'}}
                /><br></br>
                <Link to={`/game/${game._id}`}><Button onClick={() => dispatch(getOneGame(game?._id))}>See Game</Button></Link>
            </Card.Title>
        </Card.Body>
    </Card>
    )})
    :
    drawnGames.map((game, index) => {
        let opponent = users && users
        .filter(u => u._id !== user._id)
        .find(u => u._id === game.whitePlayerId || u._id === game.blackPlayerId)
    return (
    <Card key={index} style={{marginBottom:'20px'}}>
        <Card.Header style={{display:'flex', justifyContent:'space-between'}}>
            <strong>{opponent?.userName}</strong>
            <img 
            variant="top" 
            src={opponent?.picture ? `/images/${opponent.picture.path}` : "/images/noAvatar.png"}
            crossOrigin='anonymous' 
            className='user_picture'
            />
        </Card.Header>
        <Card.Body style={{textAlign:'center'}}>
            <Card.Title>Draw<br></br>
                <img 
                src='/images/draw.jpg' 
                alt=""
                style={{width:'20px', height:'20px'}}
                /><br></br>
                <Link to={`/game/${game._id}`}><Button onClick={() => dispatch(getOneGame(game?._id))}>See Game</Button></Link>
            </Card.Title>
        </Card.Body>
    </Card>
    )})
    }
</div>
)}

export default Games