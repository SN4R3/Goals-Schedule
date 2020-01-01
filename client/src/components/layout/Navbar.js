import React, { Component } from "react";
import { Link } from "react-router-dom";
import Login from "../forms/Login";
import "./Navbar.css";
import axios from "axios";

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
    let userButtons = (
      <React.Fragment>
        <button
          className="btn btn-light"
          id="loginToggled"
          onClick={e => {
            this.handleToggle(e);
          }}
        >
          <i className="fas fa-key"></i> Login
        </button>
        <Link to="/register">
          <button className="btn btn-secondary">
            <i className="fas fa-edit"></i> Sign Up
          </button>
        </Link>
        <div
          id="navbarLoginWrapper"
          style={{ zIndex: "1" }}
          className={this.state.loginToggled ? "d-block" : "d-none"}
        >
          <Login hideLogin={this.hideLogin} />
        </div>
      </React.Fragment>
    );

    if (this.props.user) {
      userButtons = (
        <React.Fragment>
          <Link to="/dashboard">
            <button className="btn btn-primary">
              <i className="fas fa-user-circle"></i> My Dashboard
            </button>
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => {
              axios.get("/api/auth/logout").then(res => {
                window.location.href = '/';
              });
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </React.Fragment>
      );
    }

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
            {userButtons}
          </div>
        </div>
      </div>
    );
  }
}
const userContainer = {
  position: "relative"
};
