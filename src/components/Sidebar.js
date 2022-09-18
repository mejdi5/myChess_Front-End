import React,{useState} from 'react';
import { useSelector } from 'react-redux';
import {CDBSidebar,CDBSidebarContent,CDBSidebarHeader,CDBSidebarMenu,CDBSidebarMenuItem} from 'cdbreact';
import {Button, Modal, Form} from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'

const Sidebar = ({currentGame, socket, onlineUsers, notifications, setNotifications}) => {

    const user = useSelector(state => state.user);
    const invitations = useSelector(state => state.invitations);
    const [showUsers, setShowUsers] = useState(false);
    const [filteringword, setFilteringword] = useState('');
    const navigate = useNavigate()


    //check if there is a current game
    const checkGame = () => {
        if(currentGame && currentGame?.whitePlayerId && currentGame?.blackPlayerId) {
            navigate(`/game/${currentGame?.whitePlayerId}/${currentGame?.blackPlayerId}`)
        } else {
            setShowUsers(true)
        }
    }

    //send invitation
    const sendInvitation = (opponentId) => {
        const newInvitation = {senderId: user._id, receiverId: opponentId}
        socket.current.emit("sendInvitation", newInvitation)
        setShowUsers(false);
    }


return (
<div className="sidebar">
<CDBSidebar>
    <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>Menu</CDBSidebarHeader>
    <CDBSidebarContent className="sidebar-content">
        <CDBSidebarMenu>
                <CDBSidebarMenuItem 
                icon="columns" 
                onClick={checkGame}
                className="sidebarLink"
                >New Game
                </CDBSidebarMenuItem>
                <Link to="/invitations">
                    <CDBSidebarMenuItem 
                    icon="columns"
                    className="sidebarLink"
                    onClick={() => setNotifications([])}
                    >Invitations
                    {notifications?.length > 0 && 
                    <>
                    <img 
                    src='/images/notification.png' 
                    alt="" 
                    style={{height:'15px', width:'15px', marginLeft:'10px'}}/>
                    <strong style={{color:'red', marginLeft:'5px'}}>{invitations?.length}</strong>
                    </>}
                    </CDBSidebarMenuItem>
                </Link>
                <Link to={`/randomGame/${user?._id}`}>
                    <CDBSidebarMenuItem 
                    icon="columns"
                    className="sidebarLink"
                    >Random Game
                    </CDBSidebarMenuItem>
                </Link>
                <Link to={`/profile/${user?._id}`}>
                    <CDBSidebarMenuItem 
                    icon="columns"
                    className="sidebarLink"
                    >My Profile
                    </CDBSidebarMenuItem>
                </Link>
            <Link to={`/allGames/${user?._id}`}>
                <CDBSidebarMenuItem 
                icon="columns"
                className="sidebarLink"
                >My Games
                </CDBSidebarMenuItem>
            </Link>
        </CDBSidebarMenu>
    </CDBSidebarContent>
</CDBSidebar>
    {
    !currentGame &&
    <Modal show={showUsers} onHide={() => setShowUsers(false)} style={{textAlign:'center'}}>
        <Modal.Header closeButton>
            <Modal.Title style={{marginLeft:'30%'}}>Start New Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label><strong>Search</strong></Form.Label>
                    <Form.Control 
                    type='text'
                    placeholder='Find an opponent..'
                    onChange={e => setFilteringword(e.target.value)}
                    />
                </Form.Group>
            </Form>
        {onlineUsers && onlineUsers.length > 0 
        ? onlineUsers?.map((u,index) => 
        u?._id !== user?._id && u?.userName?.toLowerCase().trim().startsWith(filteringword.toLowerCase().trim()) &&
        <div
        className="opponent_modal"
        key={index}>
            <div className='opponent'>
            <img 
            className='opponent_picture'
            src={u?.picture ? `/images/${u?.picture?.path}` : "/images/noAvatar.png"}
            alt=""
            />
            <h4>{u?.userName}</h4>
            </div>
            <Button 
            variant="success"
            className="newGame_button"
            onClick={() => sendInvitation(u?._id)}
            >Send Invitation</Button>
        </div>)
        : 
        <h5>No one is available</h5>
        }
        </Modal.Body>
    </Modal>
    }
    
</div>
)}


export default Sidebar;