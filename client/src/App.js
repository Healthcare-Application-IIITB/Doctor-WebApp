import React, { Component, Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Nav from "react-bootstrap/Nav";
import AuthService from "./services/auth.service";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Login from "./components/login.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import VideoCall from './components/VideoCall.component';
import EventBus from "./common/EventBus";
import Dashboard from "./components/dashboard-component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div style={{width:"100%"}}>
        <Navbar collapseOnSelect expand="lg" variant="dark" style={{backgroundColor: "#5e17eb"}}>
          <Container>
            <Navbar.Brand href={"/home"}><img src="https://drive.google.com/uc?export=view&id=1greq1-QNqtuKNhrDraFNhltJIVvPt2KE" alt="Mountain" style={{width:"144px",height:"54px"}}></img></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                </Nav>
                <Nav>
                {currentUser ? (
                  <Fragment>
                    <Nav.Link href={"/dashboard"} style={{color:"white",fontWeight:"bold", fontSize:"17px"}}>Dashboard</Nav.Link>
                    <Nav.Link href={"/profile"} style={{color:"white",fontWeight:"bold", fontSize:"17px"}}>Profile</Nav.Link>
                    <Nav.Link href={"/video"} style={{color:"white", fontWeight:"bold", fontSize:"17px"}}>Consultation</Nav.Link>
                    <Nav.Link href="/login" onClick={this.logOut} style={{color:"white", fontWeight:"bold", fontSize:"17px"}}>
                      LogOut
                    </Nav.Link>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Nav.Link href={"/login"} style={{color:"white", fontSize:"17px", fontWeight:"bold"}}>Login</Nav.Link>
                  </Fragment>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/video" element={<VideoCall/>} />
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
