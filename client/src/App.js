import {useEffect, useState} from 'react';
import {Button, Col, Container, Navbar, Row, Toast} from 'react-bootstrap';
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from 'react-router-dom';
import LinearProgress from '@material/react-linear-progress';
import 'bootstrap/dist/css/bootstrap.min.css';
import Icons from './components/Icons';
import './App.css';
import Filters from './components/Filters';
import Tasks from './components/Tasks';
import * as TasksApi from './services/api.service.js';
import Login from './components/Login';

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} description
 * @property {?import('dayjs')} deadline
 * @property {?boolean} important
 * @property {?boolean} private
 * @property {?boolean} completed
 */

export default function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [welcomeNotification, setWelcomeNotification] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  const handleApiException = (e) => {
    if (e.statusCode === 401) {
      setAuthenticatedUser(false);
    } else {
      // TODO NOTIFY ERROR
      console.log(e);
    }
  };

  const handleLogout = () => {
    TasksApi.logout().then(() => {
      setAuthenticatedUser(false);
    });
  };

  useEffect(() => {
    if (authenticatedUser !== null) {
      setTimeout(() => {
        setShowLoadingIndicator(false);
      }, 800);
    } else {
      setShowLoadingIndicator(true);
    }
  }, [authenticatedUser]);

  return <>
    {<LinearProgress className="loader"
                     indeterminate
                     closed={!showLoadingIndicator}
                     bufferingDots={false}/>}
    <Router>
      <Switch>
        <Route path="/login" render={() =>
          authenticatedUser !== false ? (
            <Redirect to="/"/>
          ) : <Login setAuthenticatedUser={setAuthenticatedUser} setWelcomeNotification={setWelcomeNotification}/>
        }/>
        <Route path="/:filter?" render={() =>
          authenticatedUser === false ? (
            <Redirect to="/login"/>
          ) : (
            <div className="d-flex flex-column vh-100">
              <Navbar variant="dark" expand="sm" bg="success">
                <Container fluid className="d-flex align-items-center">
                  <Navbar.Toggle aria-controls="example-collapse-text"
                                 aria-expanded={showSidebar}
                                 aria-label="Toggle sidebar"
                                 onClick={() => setShowSidebar(oldValue => !oldValue)}/>
                  <Navbar.Brand as={Link} to={"/"} className="mr-auto ml-auto ml-sm-0">
                    {Icons.IconLogo}
                    ToDo Manager
                  </Navbar.Brand>

                  <div className="nav-item navbar-nav">
                    <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                  </div>
                </Container>
              </Navbar>

              <Container fluid className="main flex-fill">
                <Row className="h-100">
                  <Col id="sidebar"
                       sm={4}
                       className={`scroll-y h-100 d-sm-block bg-light pt-3 ${!showSidebar && 'd-none'}`}>
                    <Filters/>
                  </Col>

                  <Col className="scroll-y h-100 pt-3" sm={8}>
                    {welcomeNotification === true &&
                    <Toast onClose={() => setWelcomeNotification(false)} show={welcomeNotification} delay={3000}
                           animation={false} autohide className="welcome-toast">
                      <Toast.Header>
                        <strong className="me-auto">ToDo Manager</strong>
                      </Toast.Header>
                      <Toast.Body>Welcome {authenticatedUser.name}!</Toast.Body>
                    </Toast>
                    }
                    <Tasks handleApiException={handleApiException}/>
                  </Col>
                </Row>
              </Container>
            </div>)
        }/>
      </Switch>
    </Router>
  </>;
}
