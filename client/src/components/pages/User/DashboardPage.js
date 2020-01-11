import React, { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";
import axios from "axios";

import NewGoalPage from "./NewGoalPage";

export class DashboardPage extends Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      selectedCat: "",
      newCategoryName: null
    };
    this.form = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.submitCategory = this.submitCategory.bind(this);
    this.deleteSelectedCategory = this.deleteSelectedCategory.bind(this);
  }

  componentDidMount() {
    axios.get("/api/goal/user").then(res => {
      this.setState({ categories: res.data });
    });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitCategory(e) {
    e.preventDefault();
    if (this.form.current.reportValidity()) {
      axios
        .post("/api/category", { name: this.state.newCategoryName })
        .then(res => {
          res.data.goals = [];
          this.setState({
            categories: [...this.state.categories, res.data],
            newCategoryName: null,
            selectedCat: res.data.id
          });
        });
    }
  }

  renderNewCategoryForm() {
    if (this.state.newCategoryName !== null) {
      return (
        <form ref={this.form} onSubmit={this.submitCategory}>
          <label htmlFor="name">
            Category <span style={{ color: "red" }}>*</span>
          </label>
          <div className="input-group mt-2 mb-2">
            <input
              type="text"
              name="newCategoryName"
              value={this.state.newCategoryName}
              onChange={this.handleChange}
              minLength="2"
              maxLength="255"
              required
              className="form-control"
            />
            <div className="input-group-append">
              <button className="btn btn-success btn-sm">
                <i className="fa fa-plus"></i> Add
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  this.setState({ newCategoryName: null });
                }}
              >
                <i className="fa fa-times"></i> Cancel
              </button>
            </div>
          </div>
        </form>
      );
    } else {
      return <React.Fragment></React.Fragment>;
    }
  }

  renderNewCategoryBtn() {
    if (this.state.newCategoryName !== null) {
      return <React.Fragment></React.Fragment>;
    } else {
      return (
        <button
          className="btn btn-success btn-sm"
          onClick={() => {
            this.setState({ newCategoryName: "" });
          }}
        >
          <i className="fa fa-plus"></i> New Category
        </button>
      );
    }
  }

  renderGoals() {
    const { categories, selectedCat } = this.state;
    if (!categories.length) return <p>Nothing to show!</p>;
    else {
      let result;
      if (selectedCat) {
        let cat = this.getSelectedCat();
        result = cat.goals.map(goal => (
          <li style={goalListItem} key={`goal${goal.id}`}>
            {goal.name}{" "}
            <a className="btn btn-danger" onClick={() => this.deleteGoal(goal)}>
              Delete
            </a>
            {goal.milestones.length
              ? this.renderMilestones(goal.milestones)
              : ""}
          </li>
        ));
      } else {
        result = categories.map(cat =>
          cat.goals.map(goal => (
            <li style={goalListItem} key={`goal${goal.id}`}>
              {goal.name}{" "}
              <a
                className="btn btn-danger"
                onClick={() => this.deleteGoal(goal)}
              >
                Delete
              </a>
              {goal.milestones.length
                ? this.renderMilestones(goal.milestones)
                : ""}
            </li>
          ))
        );
      }
      return result.length ? result : <p>Nothing to show!</p>;
    }
  }

  renderMilestones(milestones) {
    return (
      <ul>
        {milestones.map(ms => (
          <li style={msListItem} key={`ms${ms.id}`}>
            {ms.name} <a className="btn btn-danger">Delete</a>
          </li>
        ))}
      </ul>
    );
  }

  deleteSelectedCategory() {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        this.getSelectedCat().name
      }? All it's Goals & Milestones will also be deleted.`
    );
    if (confirmed) {
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

  deleteGoal(goal) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${goal.name}? All it's Milestones will also be deleted.`
    );
    if (confirmed) {
    }
  }

  render() {
    const { categories, selectedCat } = this.state;
    let catOptions = categories.map(cat => (
      <option key={`catopt${cat.id}`} value={cat.id}>
        {cat.name}
      </option>
    ));
    return (
      <div>
        <Switch>
          {/* New Goal */}
          <Route path="/dashboard/new-goal">
            <NewGoalPage
              category={
                categories.filter(c => {
                  return c.id === Number(selectedCat);
                })[0]
              }
            />
          </Route>
          {/* 'Home' */}
          <Route path="/">
            <h2>My Dashboard</h2>
            {this.renderNewCategoryForm()}
            <div className="input-group mb-3">
              <select
                name="selectedCat"
                className="custom-select"
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
              <div
                className={`text-right ${
                  this.state.categories.length ? "" : "d-none"
                }`}
              >
                <Link to="/dashboard/new-goal">
                  <button className="btn btn-info">
                    <i className="fa fa-plus"></i> New Goal
                  </button>
                </Link>
                <button
                  className={`btn btn-danger ml-2 ${
                    this.state.selectedCat ? "" : "d-none"
                  }`}
                  onClick={() => this.deleteSelectedCategory()}
                >
                  <i className="fa fa-minus-circle"></i> Delete Category
                </button>
              </div>
              {/* Goals List */}
              <h3>
                My Goals{" "}
                {this.state.selectedCat
                  ? `for ${this.getSelectedCat().name}`
                  : ""}
              </h3>
              <ul className="mt-4 mb-4" style={goalsList}>
                {this.renderGoals()}
              </ul>
            </div>
          </Route>
        </Switch>
      </div>
    );
  }
}

const goalsList = {
  listStyleType: "none"
};

const goalListItem = {
  backgroundColor: "#f1f1f1",
  padding: "10px"
};

const msListItem = {
  backgroundColor: "#f1f1f1",
  padding: "10px",
  paddingLeft:"15px",
}
export default DashboardPage;
