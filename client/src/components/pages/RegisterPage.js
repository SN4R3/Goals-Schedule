import React, { Component } from 'react'
import Register from '../forms/Register'

export class RegisterPage extends Component {

  render() {
    return (
      <div>
        <h2 className="text-center">Sign Up Page</h2>
        <div className="col-xs-12 col-lg-8 offset-lg-2">
          <Register userLoggedIn={(user) => this.props.userLoggedIn(user)}/>
        </div>
      </div>
    )
  }
}

export default RegisterPage
