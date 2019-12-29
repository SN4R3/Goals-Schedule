import React, { Component } from 'react'

export default class Login extends Component {
  render() {
    return (
      <div className="loginForm">
        <form action="/login" method="post">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" className="form-control"/>
          <br/>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" className="form-control"/>
          <button type="submit" className="btn btn-primary">Login</button>
          <button type="button" className="btn btn-light" onClick={this.props.hideLogin}>Cancel</button>
        </form>
      </div>
    )
  }
}