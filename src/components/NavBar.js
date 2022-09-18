import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import { logout } from '../Redux/actions/userActions';
import {Navbar, Container, Nav, Button} from 'react-bootstrap'
import {Link} from 'react-router-dom'

const NavBar = (setCurrentGame) => {

const dispatch = useDispatch();

const isAuth = useSelector((state) => state.isAuth);
const user = useSelector((state) => state.user);

let navigate = useNavigate();

const logoutUser = () => {
    dispatch(logout());
    setCurrentGame(null)
    navigate(`/`);
};





return (
<div>
<Navbar bg="primary" variant="dark">
    <Container>
        <Navbar.Brand href="/">
            <img 
            src="/images/chess.png" 
            alt=""
            style={{width:'25px', height:'25px', marginRight:'10px'}}
            />
            <strong style={{color:'white'}}>myChess</strong>
        </Navbar.Brand>
        {isAuth && user && 
        <>
        <Link to={`/profile/${user?._id}`}>
            <div className="user_title">
            <img 
            className="user_picture" 
            src={user?.picture 
                ? `/images/${user.picture.path}`
                : "/images/noAvatar.png"}
                crossOrigin='anonymous' 
            alt=""
            />
            {user && 
            <strong className='user_name'>{user.userName}</strong>
            }
            </div>
        </Link>
        <Button variant="dark" onClick={logoutUser}>Logout</Button>
        </>}   
                
        {!isAuth && 
        <div>
        <Nav>
            <div><Login/></div>
            <div><Register/></div>
        </Nav>
        </div>
        }
    </Container>
</Navbar>
</div>
)
};

export default NavBar;