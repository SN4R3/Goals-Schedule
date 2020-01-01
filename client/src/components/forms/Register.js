import React, { Component } from "react";

export default class Register extends Component {
  constructor() {
    super();
    this.form = React.createRef();
    this.conf_password = React.createRef();
    this.state = {
      name: "Matt",
      email: "mattf1993@hotmail.com",
      password: "password1234",
      conf_password: "",
      error: false,
      loading: false,
      showPassword: false,
      showConfPassword: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState({ [name]: value });
    //confirm password valiation
    //due to bugs in some versions of firefox/chrome
    //setCustomerValidaty must be done on change instead of onSubmit.
    if (name === "conf_password") {
      if (value !== this.state.password) {
        this.conf_password.current.setCustomValidity("Passwords don't match");
        this.form.current.reportValidity();
      } else {
        this.conf_password.current.setCustomValidity("");
        this.form.current.reportValidity();
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ error: !this.form.current.reportValidity() });
    if(!this.state.error) {
      this.setState({ loading: true })
    }
  }

  render() {
    return (
      <div className="registerForm">
        <p className="text-center">
          <em>
            Required fields are marked with -{" "}
            <strong style={{ color: "red" }}>*</strong>
          </em>
        </p>
        <form ref={this.form} onSubmit={this.handleSubmit}>
          {/* Name */}
          <label htmlFor="name">
            Name <strong style={{ color: "red" }}>*</strong>
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            minLength="2"
            maxLength="255"
            required
            value={this.state.name}
            onChange={this.handleChange}
          />
          <br />
          {/* Email */}
          <label htmlFor="email">
            Email <strong style={{ color: "red" }}>*</strong>
          </label>
          <input
            type="email"
            required
            name="email"
            className="form-control"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <br />
          {/* Password */}
          <label htmlFor="password">
            Password <strong style={{ color: "red" }}>*</strong>
          </label>
          <div style={{ display: "flex" }}>
            <input
              type={`${this.state.showPassword ? "text" : "password"}`}
              name="password"
              minLength="8"
              maxLength="255"
              required
              className="form-control"
              value={this.state.password}
              onChange={this.handleChange}
            />
            <div style={passwordCheck}>
              <input
                type="checkbox"
                name="showPassword"
                checked={this.state.showPassword}
                onChange={this.handleChange}
              />
              <i className="fa fa-eye ml-1"></i>
            </div>
          </div>
          <br />
          {/* Confirm Password */}
          <label htmlFor="conf_password">
            Confirm Password <strong style={{ color: "red" }}>*</strong>
          </label>
          <div style={{display:'flex'}}>
          <input
            type={`${this.state.showConfPassword ? "text" : "password"}`}
            name="conf_password"
            ref={this.conf_password}
            minLength="8"
            maxLength="255"
            required
            className="form-control"
            value={this.state.conf_password}
            onChange={this.handleChange}
          />
          <div style={passwordCheck}>
            <input
              type="checkbox"
              name="showConfPassword"
              checked={this.state.showConfPassword}
              onChange={this.handleChange}
            />
            <i className="fa fa-eye ml-1"></i>
          </div>
          </div>

          <br />
          {/* Error Message */}
          <div
            className={`alert alert-danger ${
              this.state.error ? "d-block" : "d-none"
            }`}
          >
            <p>
              <strong>
                <i className="fas fa-exclamation-circle"></i> Oops! There is
                something wrong with the form.
              </strong>
            </p>
          </div>
          {/* Register Button */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.validate}
              disabled={this.state.loading ? true : false}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const passwordCheck = {
  display: "flex",
  alignItems: "center",
  padding: "5px",
  margin: "5px",
  borderRadius: "5px",
  border: "1px solid lightgrey"
};
