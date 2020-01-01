import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import './App.css';

import NavBar from './components/layout/Navbar'

import RegisterPage from './components/pages/RegisterPage'

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{minHeight:"80vh"}}>
          <NavBar/>
          <div className="container mt-4 mb-4">
            <Switch>
              <Route path="/register">
                <RegisterPage />
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
