import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {Button, Modal, Form} from 'react-bootstrap';
import { registerUser } from '../../Redux/actions/userActions';

const Register = () => {

  const user = useSelector((state) => state.user);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = { userName, email, password };
    dispatch(registerUser(newUser));
    navigate(`/`);
    setEmail('');
    setUserName('');
    setPassword('');
    setShow(false);
  };

  return (
    <div>
      <Button variant="outline-succcess" onClick={() => setShow(true)}>Sign Up</Button>
      <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <div style={{marginLeft:'40%'}}><Modal.Title>Sign Up</Modal.Title></div>
        </Modal.Header>
        <Modal.Body>
          <Form>

            <Form.Group>
                <Form.Label style={{marginLeft:'40%'}}>User Name</Form.Label>
                <Form.Control
                  type="userName"
                  value={userName}
                  name="userName"
                  id="userName"
                  placeholder="Set user name..."
                  className="mb-3" 
                  onChange={(e) => setUserName(e.target.value)}
                />
            </Form.Group>

            <Form.Group>
                <Form.Label style={{marginLeft:'45%'}}>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  name="email"
                  id="email"
                  placeholder="Enter your email..."
                  className="mb-3" 
                  onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group>
              <Form.Label style={{marginLeft:'42%'}}>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                name="password"
                id="password"
                placeholder="Choose a password..."
                className="mb-3"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            
            <Button 
              style={{marginLeft:'40%'}}
              variant="primary" 
              type="submit"
              onClick={handleRegister}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
    </div>
  );
};

export default Register;