import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import axios from "axios";
import "./App.css";

import NavBar from "./components/layout/Navbar";
import RegisterPage from "./components/pages/RegisterPage";
import DashboardPage from "./components/pages/User/DashboardPage";

class App extends Component {
  constructor() {
    super();
    this.state = { user: null, loaded: false };
  }

  componentDidMount() {
    //fetch user
    axios.get("/api/auth/user").then(res => {
      this.setState({ user: res.data, loaded: true });
    });
  }

  render() {
    const { user, loaded } = this.state;
    let pages = <React.Fragment></React.Fragment>;
    let dashboardPage = <DashboardPage user={user} />;
    if (!user) {
      dashboardPage = <Redirect to={{ pathname: "/login" }} />;
    }
    if (loaded) {
      pages = (
        <Switch>
          <Route path="/register">
            <RegisterPage />
          </Route>
          <Route path="/dashboard">{dashboardPage}</Route>
          <Route path="/">
            <h2 className="text-center">Home Page</h2>
          </Route>
        </Switch>
      );
    }

    return (
      <Router>
        <div style={{ minHeight: "80vh" }}>
          <NavBar user={user} />
          <div className="container mt-4 mb-4">{pages}</div>
        </div>
      </Router>
    );
  }
}

export default App;
