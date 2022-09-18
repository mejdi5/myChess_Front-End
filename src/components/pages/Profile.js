import React,{useState} from 'react'
import isEmail from 'validator/es/lib/isEmail';
import {Card, Button, Modal, Form} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { editUser, deleteUser } from '../../Redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import { Axios } from '../../axios';


export default function Profile() {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [image, setImage] = useState(null)
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    
    //change picture
    const onFileChange = e => {
        e.preventDefault()
        setImage(e.target.files[0])
    }

    //post new picture
    const OnSubmit = e => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('image', image)
        Axios.post(`/api/pictures/upload`, formData)
        .then(res => {
            const editedUser = {
                userName: user.userName,
                email: user.email,
                password: user.password,
                picture: res.data.picture,
            }
            dispatch(editUser(user._id, editedUser))})
        .catch(error => console.log('Error:', error));
        setShow(false);
    }

    //delete picture
    const removePicture = (e) => {
        e.preventDefault()
        Axios
        .delete(`/api/pictures/delete/${user.picture._id}`)
        .then(res => {
            const editedUser = {
                userName: user.userName,
                email: user.email,
                password: user.password,
                picture: null,
            }
            dispatch(editUser(user._id, editedUser))})
        .catch(error => console.log('Error:', error));
        setShow(false)
    }

    const handleEdit = () => {
        const editedUser = { 
            userName: userName.length > 0 ? userName : user.userName, 
            email: isEmail(email) ? email : user.email, 
            password: password.length > 6 ? password : user.password, 
            picture: user.picture,
        }
        dispatch(editUser(user._id, editedUser))
        setShowModal(false)
        userName.length === 0 && alert('Username must not be empty');
        !isEmail(email) && alert('email not valid');
        password.length < 6 && alert('password must contain at least 6 characters')
    }

    const removeUser = () => {
        dispatch(deleteUser(user?._id));
        navigate('/');
    }

return (
<div className="profile">
    <Button 
    variant="dark"
    onClick={() => navigate(-1)}>Go back</Button>
    <Button 
    onClick={() => setShowDeleteModal(true)}
    variant="secondary"
    style={{float:'right'}}
    >Delete Account</Button>
    <div>
    <Card className="text-center profile_card ">
        <Card.Header><strong>My Profile</strong></Card.Header>
        <Card.Header>
        <img 
            variant="top" 
            src={user?.picture ? `/images/${user.picture.path}` : "/images/noAvatar.png"}
            crossOrigin='anonymous' 
            className='profile_picture'
            onClick={() => setShow(true)}
        />
        </Card.Header>
        <Card.Body>
            <Card.Title>{user?.userName}</Card.Title>
            <Card.Text>Email: {user?.email}</Card.Text>
                <Card.Text>Password: *********</Card.Text>
            <Button 
            variant="primary"
            onClick={() => setShowModal(true)}>Change</Button>
        </Card.Body>
    </Card>

    <Modal show={show} onHide={() => setShow(false)} style={{textAlign:'center'}}>
        <Modal.Header closeButton>
            <Modal.Title style={{marginLeft:'20%'}}>What do you want to do ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Label><strong>Edit Photo</strong></Form.Label><br></br>
            <Form.Control type="file" onChange={onFileChange}/><br></br>
            <Button variant="success" onClick={OnSubmit}> Update </Button>
        </Form.Group><br></br>
        <Form.Group controlId="formFile" className="mb-3">
            <Form.Label><strong>Delete Photo</strong></Form.Label><br></br>
            <Button variant="danger" onClick={removePicture}> Delete </Button>
        </Form.Group>
        </Form>
        </Modal.Body>
    </Modal>

    <Modal show={showModal} onHide={() => setShowModal(false)} style={{textAlign:'center'}}>
        <Modal.Header closeButton>
            <Modal.Title style={{marginLeft:'37%'}}>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
        <Form.Group className="mb-3">
            <Form.Label><strong>New Username</strong></Form.Label>
            <Form.Control 
            type="text"  
            placeholder='Change username...'
            onChange={e => setUserName(e.target.value)}
            />
        </Form.Group><br></br>
        <Form.Group className="mb-3">
            <Form.Label><strong>New Email</strong></Form.Label>
            <Form.Control 
            type="text" 
            placeholder='Change email...'
            onChange={e => setEmail(e.target.value)}
            />
        </Form.Group><br></br>
        <Form.Group className="mb-3">
            <Form.Label><strong>New Password</strong></Form.Label>
            <Form.Control 
            type="text"  
            placeholder='Change password...'
            onChange={e => setPassword(e.target.value)}
            />
        </Form.Group><br></br>
        <Button variant="success" onClick={handleEdit}> Save </Button>
        </Form>
        </Modal.Body>
    </Modal>

    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} style={{textAlign:'center'}}>
        <Modal.Header closeButton>
            <Modal.Title>Do you really want to delete this account ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Button variant="danger" onClick={removeUser}> Delete </Button>
        </Modal.Body>
    </Modal>

    </div>
</div>
)
}
