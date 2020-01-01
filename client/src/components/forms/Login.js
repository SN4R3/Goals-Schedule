import React, { Component } from "react";
import axios from 'axios'

export default class Login extends Component {
  constructor() {
    super()
    this.form = React.createRef();
    this.state = {
      email: 'mattf1993@hotmail.com',
      password: 'password1234',
      errMsg: '',
    }
    this.loginUser = this.loginUser.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  loginUser(e) {
    e.preventDefault()
    this.setState({errMsg: ''})
    if(this.form.current.reportValidity()) {
      const { email, password } = this.state
      axios.post('/api/auth/login', {email,password}).then(res => {
        if(res.data.error) {
          this.setState({errMsg: res.data.message});
        } else {
          this.props.hideLogin()
          window.location.href = '/dashboard'
        }
      })
    } else {
      this.setState({errMsg: 'Please re-check your credientals.'});
    }
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <div className="loginForm">
        <form ref={this.form} onSubmit={this.loginUser}>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" value={this.state.email} onChange={this.handleChange} className="form-control" required/>
          <label className="mt-2" htmlFor="password">Password:</label>
          <input type="password" name="password" className="form-control" value={this.state.password} onChange={this.handleChange} required/>
          <div
            className={`alert alert-danger mt-2 mb-2 ${
              this.state.errMsg.length ? "d-block" : "d-none"
            }`}
          >
            <p className="mb-0"><small>{this.state.errMsg}</small></p>
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={this.props.hideLogin}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }
}
