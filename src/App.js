import React,{useState, useEffect, useRef} from 'react'
import './App.css';
import { io } from "socket.io-client";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser, getAllUsers } from './Redux/actions/userActions';
import { getGames, editGame } from './Redux/actions/gameActions';
import { getInvitations, postInvitation } from './Redux/actions/invitationActions';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import NewGame from './components/pages/NewGame';
import Invitations from './components/pages/Invitations';
import Games from './components/pages/Games';
import GameShow from './components/pages/GameShow';
import RandomGame from './components/pages/RandomGame';
import Chess from 'chess.js'


function App() {

  const dispatch = useDispatch();
  const users = useSelector(state => state.users);
  const games = useSelector(state => state.games);
  const user = useSelector(state => state.user);
  const invitations = useSelector(state => state.invitations);

  const [currentGame, setCurrentGame] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([])

  const socket = useRef()
  let [chess] = useState(new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"));

  const [fen, setFen] = useState(chess.fen());


  useEffect(() => {
    //get all users
    dispatch(getAllUsers());
    //get authentified current user
    dispatch(getAuthUser())
    //get games of current user
    user && dispatch(getGames(user?._id))
    //get invitations of current user
    dispatch(getInvitations(user?._id))
  }, []);

  useEffect(() => {
    //socket config
    const url = process.env.NODE_ENV === 'development' ? "http://localhost:5000" : "https://mychess1.herokuapp.com/"
    socket.current = io(url);
    //set and get online users
    socket.current.emit("addUser", user?._id);
    socket.current.on("getUsers", Users => {
    setOnlineUsers(
    users?.filter(el => Users.some((u) => u.userId === el._id)))
    })
  }, [users]);

  useEffect(() => {
    const availableGame = games.find(g => Object.values(g).includes(user?._id) && !g.isFinished)
    availableGame && setCurrentGame(availableGame)
  }, [games])

//current user's moves
const handleMove = (move) => {
    if (chess.move(move)) {
      setFen(chess.fen());
      socket.current.emit("move", {
        move: move,
        opponentId: opponent?._id
      });
    }
}
//persist fen after loading page
useEffect(() => {
  setFen(window.localStorage.getItem('fen'));
}, []);
useEffect(() => {
  window.localStorage.setItem('fen', fen);
}, [fen]);

//get opponent's move
useEffect(() => {
socket.current.on("getMove", ({move}) => {
    handleMove(move)
})}, [currentGame, socket])


  //when opponent resigns
  useEffect(() => 
  socket.current.on("getResignedGame", ({_id}) => {
      dispatch(editGame(user?._id, currentGame?._id, {
          _id,
          whitePlayerId: currentGame?.whitePlayerId,
          blackPlayerId: currentGame?.blackPlayerId,
          isFinished: true,
          winner: user._id, 
          history: chess?.history({ verbose: true })
      }));
      setCurrentGame(null);
      alert(`${user?.userName} won by resign`)
      setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  }), [currentGame, socket])


    //receive invitations and notifications
    useEffect(() =>
    !currentGame &&
    socket.current.on("getInvitation", (newInvitation) => {
      dispatch(postInvitation(newInvitation, user._id))
      setNotifications([...notifications, newInvitation])
    }) , [invitations])

    //get accepted invitation and start game
    useEffect(() => {
    socket.current.on("getAcceptedInvitation", (newGame) => {
      setCurrentGame(newGame)
    })}, [currentGame, games, socket])

  const opponent = users && users
  .filter(u => u._id !== user?._id)
  .find(u => u._id === currentGame?.whitePlayerId || u._id === currentGame?.blackPlayerId)


  return (
    <div className="App">
      <BrowserRouter>

      <NavBar setCurrentGame={setCurrentGame}/>
      <div style={{display:'flex'}}>

      {user && <Sidebar 
      currentGame={currentGame} 
      socket={socket}
      onlineUsers={onlineUsers}
      notifications={notifications}
      setNotifications={setNotifications}
      />}

        <Routes>
          <Route exact path="/" element={!currentGame ? <Home/> : <Navigate to={`/game/${currentGame?.whitePlayerId}/${currentGame?.blackPlayerId}`}/>} />

          <Route path="/invitations" element={
            !user ? <Navigate to='/'/> :
            !currentGame 
            ?
            <Invitations 
            currentGame={currentGame}
            setCurrentGame={setCurrentGame}
            socket={socket}
            setNotifications={setNotifications}
            />
            : 
            <Navigate to={`/game/${currentGame?.whitePlayerId}/${currentGame?.blackPlayerId}`}/>
          } 
          />

          <Route path="/randomGame/:userId" element={
          !user ? <Navigate to='/'/> :
          !currentGame ?
          <RandomGame/>
          :
          <Navigate to={`/game/${currentGame?.whitePlayerId}/${currentGame?.blackPlayerId}`}/>
          }/>

          <Route path="/profile/:userId" element={
          !user ? <Navigate to='/'/> :
          !currentGame ?
          <Profile/>
          :
          <Navigate to={`/game/${currentGame?.whitePlayerId}/${currentGame?.blackPlayerId}`}/>
          }/>

          <Route path="/allGames/:userId" element={
          !user ? <Navigate to='/'/> :
          !currentGame ?
          <Games/>
          :
          <Navigate to={`/game/${currentGame?.whitePlayerId}/${currentGame?.blackPlayerId}`}/>
          }/>

          <Route path="/game/:gameId" element={
          !user ? <Navigate to='/'/> :
          !currentGame ?
          <GameShow/>
          :
          <Navigate to={`/game/${currentGame?.whitePlayerId}/${currentGame?.blackPlayerId}`}/>
          }/>

          <Route 
          path="/game/:whitePlayerId/:blackPlayerId" 
          element={
            currentGame 
            ?
            <NewGame 
            currentGame={currentGame} 
            setCurrentGame={setCurrentGame}
            chess={chess}
            socket={socket}
            opponent={opponent}
            handleMove={handleMove}
            fen={fen}
            setFen={setFen}
            />
            :
            <Navigate to='/'/>
          }/>

        </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
