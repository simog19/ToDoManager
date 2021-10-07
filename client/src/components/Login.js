import {Alert, Button, Form} from 'react-bootstrap';
import {useState} from 'react';
import {Redirect} from 'react-router-dom';
import * as Api from '../services/api.service.js';
import Icons from './Icons';

export default function Login({setAuthenticatedUser, setWelcomeNotification}) {
  const [feedback, setFeedback] = useState(false);
  const [formValidated, setFormValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successfulLogin, setSuccessfulLogin] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    const isValid = form.checkValidity();
    setFormValidated(true);
    if (isValid) {
      Api.login(email, password).then((user) => {
        setWelcomeNotification(true);
        setSuccessfulLogin(true);
        setAuthenticatedUser(user);
      }).catch((e) => {
        setFeedback(e.message);
      });
    }
  };

  return successfulLogin ? <Redirect to="/"/> : (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-success">
      <div className="py-2 text-white">
        {Icons.IconLogo}
        ToDo Manager
      </div>
      <Form noValidate
            validated={formValidated}
            onSubmit={submit}
            className="w-100 rounded-lg bg-white shadow-lg login-form">
        <h3 className="mb-3">Login</h3>
        {feedback && <Alert variant="danger" onClose={() => setFeedback(false)} dismissible>
          {feedback}
        </Alert>}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email"
                        placeholder="Enter email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                        }}/>
          <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                        }}/>
          <Form.Control.Feedback type="invalid">
            Please provide a password.
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit"
                block={true}
                variant="primary"
                className="mt-4">
          Login
        </Button>
      </Form>
    </div>);
}
