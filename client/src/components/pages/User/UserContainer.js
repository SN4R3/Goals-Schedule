import React, { Component } from 'react'
import { AnimatedSwitch, spring } from "react-router-transition";
import { Route, Redirect, BrowserRouter as Router } from "react-router-dom";
import axios from 'axios'

import GoalPage from '../GoalPage'
import DashboardPage from './DashboardPage';

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
      redirector: <Redirect to="/goal" push/>
    })
    let self = this
    setTimeout(() => {
      self.setState({ redirector:null })
    }, 100)
  }

  editGoal(goal) {
    this.setState({
      selectedGoal: goal, 
      editingGoal: true,
      redirector: <Redirect to="/goal" push/>
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

  passNewGoal(goal) {
    let categories = this.state.categories
    categories.forEach((cat) => {
      if(cat.id === goal.category_id) {
        cat.goals.push(goal)
      }
    })
    this.setState({categories})
  }

  passUpdatedGoal(goal) {
    let categories = this.state.categories
    categories.forEach((cat) => {
      if(cat.id === goal.category_id) {
        cat.goals.forEach((g) => {
          if(g.id === goal.id) {
            g = goal
          } 
        })
      }
    })
    this.setState({categories})
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
      <Router basename="/user">
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
          <Route 
            path="/new-goal/:catId" 
            render={(props) => <GoalPage categories={categories} edit={true} passNewGoal={(goal) => this.passNewGoal(goal)}/>}
          />
          {/* View/Edit Goal */}
          <Route path="/goal">
            <GoalPage 
              goal={selectedGoal} 
              categories={categories}
              edit={editingGoal} 
              toggleEdit={() => this.setState({editingGoal:!this.state.editingGoal})}
              passUpdatedGoal={(goal) => this.passUpdatedGoal(goal)}
            />
          </Route>
          {/* Dashboard */}
          <Route path="/">
            <DashboardPage
              categories={categories}
              selectedCategory={selectedCategory}
              categoryCreated={this.categoryCreated}
              categorySelected={this.categorySelected}
              deleteCategory={this.deleteCategory}
              goalDeleted={this.goalDeleted}
              viewGoal={this.viewGoal}
              editGoal={(goal) => this.editGoal(goal)}
              toggleEdit={this.toggleEdit}
              passUpdatedGoal={(goal) => this.passUpdatedGoal(goal)}
            />
            {this.renderRedirector()}
          </Route>
        </AnimatedSwitch>
      </Router>
    )
  }
}

export default UserContainer
