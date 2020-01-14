import React, { Component } from 'react'
import { AnimatedSwitch, spring } from "react-router-transition";
import { Route, Redirect } from "react-router-dom";
import axios from 'axios'

import DashboardPage from './DashboardPage';
import NewGoalPage from "../NewGoalPage";
import GoalPage from '../GoalPage'

export class UserContainer extends Component {

  constructor() {
    super()
    this.state = {
      categories: [],
      selectedCategory: null,
      selectedGoal: null,
      editingGoal: null,
    }
    this.categoryCreated = this.categoryCreated.bind(this);
    this.categorySelected = this.categorySelected.bind(this)
    this.deleteCategory = this.deleteCategory.bind(this);
    this.goalDeleted = this.goalDeleted.bind(this)
    this.viewGoal = this.viewGoal.bind(this)
    this.editGoal = this.editGoal.bind(this)
    this.renderRedirector = this.renderRedirector.bind(this)
  }

  componentDidMount() {
    axios.get("/api/goal/user").then(res => {
      this.setState({ categories: res.data });
    });
  }

  //router transitions
  mapStyles(styles) {
    return {
      opacity: styles.opacity,
      transform: `translateY(${styles.translateY}%)`
    };
  }
  bounce(val) {
    return spring(val, {
      stiffness: 330,
      damping: 22
    });
  }

  viewGoal(goal) {
    this.setState({
      selectedGoal: goal, 
      editingGoal: false, 
      redirector: <Redirect to="/user/goal" push/>
    })
  }

  editGoal(goal) {
    this.setState({
      selectedGoal: goal, 
      editingGoal: true,
      redirector: <Redirect to="/user/goal" push/>
    })
    let self = this
    setTimeout(() => {
      self.setState({ redirector:null })
    }, 100)
  }

  goalDeleted(id) {
    let categories = this.state.categories;
    categories.forEach(cat => {
      cat.goals = cat.goals.filter(cat => { return Number(cat.id) !== id })
    })
    this.setState({ categories })
  }

  categoryCreated(cat) {
    this.setState({
      categories: [...this.state.categories, cat],
      selectedCategory: cat
    });
  }

  categorySelected(id) {
    let found = this.state.categories.filter(cat => { return Number(id) === cat.id})[0]
    if(!found)
      found = ''
    this.setState({ selectedCategory: found })
  }

  deleteCategory() {
    let { selectedCategory, categories} = this.state
    let msg = `Are you sure you want to delete ${selectedCategory.name}? 
      All it's Goals & Milestones will also be deleted.`

    if (window.confirm(msg)) {
      axios.delete(`/api/category/${selectedCategory.id}`).then(res => {
        this.setState({
          categories: categories.filter(
            cat => Number(selectedCategory.id) !== cat.id
          ),
          selectedCategory: null
        });
      });
    }
  }

  renderRedirector() {
    return this.state.redirector
  }

  render() {
    const { selectedCategory, selectedGoal, editingGoal, categories } = this.state
    return (
      <AnimatedSwitch
        atEnter={{
          opacity: 0,
          translateY: 15
        }}
        atLeave={{ opacity: this.bounce(0), translateY: 15 }}
        atActive={{ opacity: this.bounce(1), translateY: 0 }}
        mapStyles={this.mapStyles}
        className="switch-wrapper"
      >
        {/* New Goal */}
        <Route path="/user/new-goal">
          <NewGoalPage category={selectedCategory}/>
        </Route>
        {/* View/Edit Goal */}
        <Route path="/user/goal">
          <GoalPage 
            goal={selectedGoal} 
            categories={categories}
            edit={editingGoal} 
            toggleEdit={() => this.setState({editingGoal:!this.state.editingGoal})}
          />
        </Route>
        {/* 'Dashboard' */}
        <Route path="/user/dashboard">
          <DashboardPage
            categories={categories}
            selectedCategory={selectedCategory}
            categoryCreated={this.categoryCreated}
            categorySelected={this.categorySelected}
            deleteCategory={this.deleteCategory}
            goalDeleted={this.goalDeleted}
            viewGoal={this.viewGoal}
            editGoal={this.editGoal}
            toggleEdit={this.toggleEdit}
          />
          {this.renderRedirector()}
        </Route>
      </AnimatedSwitch>
    )
  }
}

export default UserContainer
