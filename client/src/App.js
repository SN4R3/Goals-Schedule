import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
  Switch
} from "react-router-dom";
import { AnimatedSwitch, spring } from "react-router-transition";
import axios from "axios";
import "./App.css";

import NavBar from "./components/layout/Navbar";
import RegisterPage from "./components/pages/RegisterPage";
import UserContainer from "./components/pages/user/UserContainer";
import Login from "./components/forms/Login";

class App extends Component {
  constructor() {
    super();
    this.state = { user: null, loaded: false, redirector: <React.Fragment /> };
    this.authUser = this.authUser.bind(this);
  }

  componentDidMount() {
    this.authUser();
  }

  //router transitions
  mapStyles(styles) {
    return {
      opacity: styles.opacity,
      transform: `translateY(${styles.translateY}%)`
    };
  }
  bounce(val) {
    return spring(val, {
      stiffness: 330,
      damping: 22
    });
  }

  authUser() {
    //fetch user
    axios.get("/api/auth/user").then(res => {
      this.setState({
        user: res.data,
        loaded: true,
        redirector: res.data ? (
          <Redirect to={{ pathname: "/user/dashboard" }} />
        ) : (
          <React.Fragment />
        )
      });
    }).catch(err => {
      console.log(err)
      this.setState({loaded: true})
    })
  }

  render() {
    const { user, loaded, redirector } = this.state;
    let pages = <React.Fragment />;
    let userContainer = <UserContainer user={user} />;
    if (!user) {
      userContainer = <Redirect to={{ pathname: "/" }} />;
    }
    if (loaded) {
      pages = (
        <AnimatedSwitch
          atEnter={{
            opacity: 0,
            translateY: 15
          }}
          atLeave={{ opacity: this.bounce(0), translateY: 15}}
          atActive={{ opacity: this.bounce(1), translateY: 0 }}
          mapStyles={this.mapStyles}
          className="switch-wrapper"
        >
          <Route path="/register">
            <RegisterPage />
          </Route>
          <Route path="/user">{userContainer}</Route>
          <Route path="/">
            <div
              className="mt-5 mb-5 d-flex justify-content-center align-items-center"
              style={landingContainer}
            >
              <div className="row" style={landingChoices}>
                <div
                  className="col-xs-12 col-md-6 d-flex flex-column justify-content-center align-items-center"
                  style={{ minHeight: "200px" }}
                >
                  <div className="pt-5 pb-5">
                    <h2>Login</h2>
                    <Login userLoggedIn={this.authUser} noCancel={true} />
                  </div>
                </div>
                <div
                  className="col-xs-12 col-md-6 flex-column d-flex justify-content-center align-items-center"
                  style={{
                    minHeight: "200px",
                    borderLeft: "2px solid #eaeaea"
                  }}
                >
                  <div className="text-center pt-5 pb-5">
                    <h3>Don't have an account?</h3>
                    <Link to="/register">
                      <div className="btn btn-info">
                        <i className="fas fa-edit"></i> Register Now
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Route>
        </AnimatedSwitch>
      );
    }

    return (
      <Router>
        {redirector}
        <div style={{ minHeight: "80vh" }}>
          <NavBar user={user} userLoggedIn={this.authUser} userLoggedOut={this.authUser} />
          <div className="container mt-4 mb-4">{pages}</div>
        </div>
      </Router>
    );
  }
}

const landingContainer = {
  height: "500px"
};

const landingChoices = {
  background: "#fff",
  borderRadius: "5px",
  width: "100%",
  border: "2px solid #eaeaea"
};

export default App;
