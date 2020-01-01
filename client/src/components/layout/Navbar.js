import React, { Component } from "react";
import { Link } from 'react-router-dom'
import Login from "../forms/Login";
import "./Navbar.css";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { menuToggled: false, loginToggled: false };

    this.handleToggle = this.handleToggle.bind(this);
    this.hideLogin = this.hideLogin.bind(this);
  }

  handleToggle(e) {
    this.setState({
      [e.target.id]: !this.state[e.target.id]
    });
  }

  hideLogin() {
    this.setState({
      loginToggled: false
    });
  }

  render() {
    return (
      <div className="navbarContainer">
        <div className="navControl">
          <div className="brand">Goals Schedule</div>
          <div className="d-block d-sm-none toggler">
            <i
              className="fas fa-bars"
              id="menuToggled"
              onClick={e => {
                this.handleToggle(e);
              }}
            ></i>
          </div>
        </div>
        <div
          className={
            this.state.menuToggled
              ? "nav-items d-flex"
              : "nav-items d-none d-sm-flex"
          }
        >
          <div className="pageLinks">
            <div>
              <a href="/about">About</a>
            </div>
            <div>
              <a href="/contact">Contact</a>
            </div>
          </div>
          <div className="user-container" style={userContainer}>
            <button
              className="btn btn-light"
              id="loginToggled"
              onClick={e => {
                this.handleToggle(e);
              }}
            >
              {" "}
              <i className="fas fa-key"></i> Login
            </button>
            <Link to="/register">
              <button className="btn btn-secondary">
                {" "}
                <i className="fas fa-edit"></i> Sign Up
              </button>
            </Link>
            <div
              id="navbarLoginWrapper"
              className={this.state.loginToggled ? "d-block" : "d-none"}
            >
              <Login hideLogin={this.hideLogin} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const userContainer = {
  position: "relative"
};
