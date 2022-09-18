import React, { useState} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {Button, Modal, Form} from 'react-bootstrap';
import { loginUser } from '../../Redux/actions/userActions';
import { GoogleLogin } from 'react-google-login';
import { registerUser } from '../../Redux/actions/userActions';
import {gapi} from "gapi-script"


if(process.env.NODE_ENV === 'production') {
  gapi.load("client:auth2", () => { gapi.client.init({ clientId: process.env.REACT_APP_PROD_CLIENT_ID, plugin_name: "chat", }); });
}


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const users = useSelector(state => state.users);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
    navigate(`/`)
    setEmail('');
    setPassword('');
    setShow(false);
  };


  const googleSuccess = (res) => {
    try {
      const form = {
        userName: `${res?.profileObj.givenName} ${res?.profileObj.familyName}`,
        email: res?.profileObj.email,
        password: res?.profileObj.googleId,
      };
      const User = users?.find(u => u?.email === form?.email)
      if (!User) {
        dispatch(registerUser(form));
        navigate('/');
      } else {
        dispatch(loginUser({email: User?.email, password: User?.password}));
        navigate('/')
      }
    } catch (error) {
      console.log(error);
    }
};



  return (
    <div>
      <Button variant="success" onClick={() => setShow(true)}>Sign In</Button>
      <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <div style={{marginLeft:'40%'}}><Modal.Title>Sign In</Modal.Title></div>
        </Modal.Header>
        <Modal.Body>
          <Form>

            <Form.Group>
                <Form.Label style={{marginLeft:'42%'}}>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  name="email"
                  id="email"
                  placeholder="Your email..."
                  className="mb-3" 
                  onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group>
              <Form.Label style={{marginLeft:'40%'}}>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                name="password"
                id="password"
                placeholder="Your password..."
                className="mb-3"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            
            <Button 
              style={{marginLeft:'40%'}}
              variant="primary" 
              type="submit"
              onClick={handleLogin}>
              Submit
            </Button>
          </Form>
          <br></br>
          <Form className="g-login">
          <strong style={{marginLeft:'25%'}}>Or</strong><br></br>
            <GoogleLogin
            clientId={process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_DEV_CLIENT_ID
            : process.env.REACT_APP_PROD_CLIENT_ID}
            buttonText="Sign In With Google"
            onSuccess={googleSuccess}
            onFailure={() => console.log('Google Sign In Unsuccessful. Try Again Later')}
            cookiePolicy={'single_host_origin'}
            />
          </Form>
        </Modal.Body>
      </Modal>
    </>
    </div>
  );
};

export default Login;