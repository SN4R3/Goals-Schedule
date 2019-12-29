import React, { Component } from 'react';
import './App.css';
import NavBar from './components/layout/Navbar'

class App extends Component {
  render() {
    return (
      <div style={{minHeight:"80vh"}}>
        <NavBar/>
      </div>
    );
  }
}

export default App;
