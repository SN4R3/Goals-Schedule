import React, { Component } from "react";
import { Route, Link } from "react-router-dom";
import './Dashboard.css'
import axios from "axios";
import { AnimatedSwitch, spring } from "react-router-transition";

import NewGoalPage from "./NewGoalPage";
import NewCategory from "../../forms/NewCategory";
import GoalsList from '../../common/GoalsList'

export class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      selectedCat: "",
      creatingCategory: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.deleteSelectedCategory = this.deleteSelectedCategory.bind(this);
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

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  renderNewCategoryBtn() {
    if (this.state.creatingCategory) {
      return <React.Fragment></React.Fragment>;
    } else {
      return (
        <button 
          className="btn btn-success btn-sm" onClick={() => {
            this.setState({ creatingCategory: true });
          }}
        >
          <i className="fa fa-plus"></i> New Category
        </button>
      );
    }
  }

  categoryCreated(cat) {
    this.setState({
      categories: [...this.state.categories, cat],
      creatingCategory: false,
      selectedCat: cat.id
    });
  }

  deleteSelectedCategory() {
    let msg = `Are you sure you want to delete ${this.getSelectedCat().name}? 
      All it's Goals & Milestones will also be deleted.`

    if (window.confirm(msg)) {
      axios.delete(`/api/category/${this.state.selectedCat}`).then(res => {
        this.setState({
          categories: this.state.categories.filter(
            cat => Number(this.state.selectedCat) !== cat.id
          ),
          selectedCat: ""
        });
      });
    }
  }

  getSelectedCat() {
    return this.state.categories.filter(c => {
      return Number(this.state.selectedCat) === c.id;
    })[0];
  }

  getGoalsForViewing() {
    let res = []
    if(this.state.selectedCat) {
      return this.getSelectedCat().goals
    } else {
      this.state.categories.forEach((cat) => {
        res = res.concat(cat.goals)
      })
      return res
    }
  }

  render() {
    const { categories, selectedCat, creatingCategory } = this.state;
    let catOptions = categories.map(cat => (
      <option key={`catopt${cat.id}`} value={cat.id}>
        {cat.name}
      </option>
    ));
    return (
      <div>
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
          <Route path="/dashboard/new-goal">
            <NewGoalPage category={this.getSelectedCat()}/>
          </Route>
          {/* 'Home' */}
          <Route path="/">
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
            <div className="mt-4">
              <div className={!creatingCategory ? 'd-none' : ''}>
                <NewCategory
                  catCrearted={this.addNewCategory}
                  cancelNewCategory={() =>
                    this.setState({ creatingCategory: false })
                  }
                />
              </div>
              
              <div className="input-group mb-3">
                <select
                  name="selectedCat"
                  className={`custom-select ${creatingCategory ? "d-none" : ""}`}
                  value={this.state.selectedCat}
                  onChange={this.handleChange}
                >
                  <option value="">All Categories</option>;{catOptions}
                </select>
                <div className="input-group-append">
                  {this.renderNewCategoryBtn()}
                </div>
              </div>
              <div className="mt-4 mb-4">
                <div className={`d-flex justify-content-end my-2 ${this.state.categories.length ? "" : "d-none"}`}>
                  <div className={`${!selectedCat ? 'd-none' : ''}`}>
                    <Link to="/dashboard/new-goal">
                      <button className="btn btn-info">
                        <i className="fa fa-plus"></i> New Goal
                      </button>
                    </Link>
                  </div>
                  <button
                    className={`btn btn-danger ml-2 ${this.state.selectedCat ? "" : "d-none"}`}
                    onClick={() => this.deleteSelectedCategory()}
                  >
                    <i className="fa fa-minus-circle"></i> Delete Category
                  </button>
                </div>
                  
                <h3>
                  {this.state.selectedCat ? `${this.getSelectedCat().name} Goals` : ""}
                </h3>
                <div className="mt-4 mb-4">
                  <GoalsList goals={this.getGoalsForViewing()}/>
                </div>
              </div>
            </div>
          </Route>
        </AnimatedSwitch>
      </div>
    );
  }
}

export default DashboardPage;
