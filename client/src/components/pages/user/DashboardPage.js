import React, { Component } from 'react'
import { Route, Link, Switch, BrowserRouter as Router } from "react-router-dom";

import UserGoalsPage from './UserGoalsPage';
import UpdateableList from '../../common/UpdatedableList'

export class DashboardPage extends Component {

  constructor() {
    super()
    this.state ={ activeTab: 'upcoming' }
  }

  render() {
    let { activeTab } = this.state
    return (
      <Router>
        <div className="d-flex justify-content-between align-items-center border title-container">
          <h1>
            <i className="fas fa-tachometer-alt"></i>
            <span className="ml-2">Dashboard</span>
          </h1>
          <div className="d-none d-sm-block">
            <button className="btn btn-dark">
              <i className="fa fa-user"></i>
              <span className="ml-1">Profile</span>
            </button>
          </div>
        </div>
        <div className="d-flex my-2 justify-content-around align-items-center">
          <Link to="/user" style={{width:'100%'}} onClick={() => this.setState({activeTab: 'upcoming'})}>
            <div className={`btn btn-${activeTab === 'upcoming' ? 'secondary' : 'light'} border p-3 d-block`}>
              Upcoming
            </div>
          </Link>
          <Link to="/user/goals" style={{width:'100%'}} onClick={() => this.setState({activeTab: 'goals'})}>
            <div className={`btn btn-${activeTab === 'goals' ? 'secondary' : 'light'} border p-3 d-block`}>
              Goals
            </div>
          </Link>
        </div>
        <Switch>
          <Route path="/user/goals">
            <UserGoalsPage
              categories={this.props.categories}
              selectedCategory={this.props.selectedCategory}
              categoryCreated={this.props.categoryCreated}
              categorySelected={this.props.categorySelected}
              deleteCategory={this.props.deleteCategory}
              goalDeleted={this.props.goalDeleted}
              viewGoal={this.props.viewGoal}
              editGoal={(goal) => this.props.editGoal(goal)}
              toggleEdit={this.props.toggleEdit}
              newGoal={this.props.newGoal}
            />
          </Route>
          <Route path="/">
            <UpdateableList 
              categories={this.props.categories}
              passUpdatedGoal={(goal) => this.props.passUpdatedGoal(goal)}
              editGoal={(goal) => this.props.editGoal(goal)}
            />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default DashboardPage
