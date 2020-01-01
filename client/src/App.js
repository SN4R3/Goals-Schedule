import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import './App.css';

import NavBar from './components/layout/Navbar'

import RegisterPage from './components/pages/RegisterPage'
import DashboardPage from './components/pages/User/DashboardPage'

class App extends Component {
  constructor() {
    super()
    this.state = { user: null }
  }

  userLoggedIn(user, history) {
    this.setState({user}); 
    history.push('/dashboard');
  }

  render() {
    const user = this.state.user
    let dashboardPage = <DashboardPage user={user}/>
    if(!user) {
      dashboardPage = <p>Nope</p>
    }

    return (
      <Router>
        <div style={{minHeight:"80vh"}}>
          <Route render={({ history }) => (
            <NavBar userLoggedIn={(user) =>  this.userLoggedIn(user, history)}/>
          )}/>
          <div className="container mt-4 mb-4">
            <Switch>
              <Route path="/register" render={({ history }) => (
                <RegisterPage userLoggedIn={(user) =>  this.userLoggedIn(user, history)}/>
              )}/>
              <Route path="/dashboard">
                {dashboardPage}
              </Route>
              <Route path="/">
                <h2 className="text-center">Home Page</h2>
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    )

  }
}

export default App;
