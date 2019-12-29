import React, { Component } from "react";
import Login from "../forms/Login";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { menuToggled: false, loginToggled: false };

    this.handleToggle = this.handleToggle.bind(this);
    this.hideLogin = this.hideLogin.bind(this)
  }

  handleToggle(e) {
    this.setState({
      [e.target.id]: !this.state[e.target.id]
    });
  }

  hideLogin() {
    this.setState({
      loginToggled: false,
    })
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
            <button className="btn btn-secondary">
              {" "}
              <i className="fas fa-edit"></i> Sign Up
            </button>
            <div
              className={this.state.loginToggled ? "d-block" : "d-none"}
              id="loginToggled"
              style={this.state.menuToggled ? popupStyle : absoluteStyle}
            >
              <Login hideLogin={this.hideLogin}/>
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
const absoluteStyle = {
  position: "absolute",
  top: "75px",
  right: "5px",
  padding: "10px",
  border: "1px solid #eaeaea",
  borderRadius: "5px",
  width: "115%",
};
const popupStyle = {
  position: "fixed",
  padding: "10px",
  background: "whitesmoke",
  borderRadius: "5px",
  width: "95%",
};