import React, { Component } from 'react'

export class DashboardPage extends Component {
  render() {
    return (
      <div>
        <h2 className="text-center">Dashboard</h2>
        <p>Hello {this.props.user.name}</p>
      </div>
    )
  }
}

export default DashboardPage
