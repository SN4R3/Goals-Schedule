import React, { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";
import axios from "axios";

import NewGoalPage from './NewGoalPage'

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
  }

  componentDidMount() {
    axios.get("/api/goal/all/withCategories").then(res => {
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
    if (!categories.length) return <li>Nothing to show!</li>;
    else {
      let result;
      if (selectedCat) {
        let cat = categories.filter(c => {
          return Number(selectedCat) === c.id;
        })[0];
        result = (
          <li key={`cat${cat.id}`}>
            {cat.name}
            {cat.goals.map(goal => (
              <li key={`goal${goal.id}`}>{goal.name}</li>
            ))}
            <Link to="/dashboard/new-goal">
              New Goal
            </Link>
          </li>
        );
      } else {
        result = (categories.map(cat => (
          <li key={`cat${cat.id}`}>
            {cat.name}
            {cat.goals.map(goal => (
              <li key={`goal${goal.id}`}>{goal.name}</li>
            ))}
            <Link to="/dashboard/new-goal" onClick={() => this.setState({selectedCat: cat.id})}>
               New Goal
            </Link>
          </li>
        )));
      }
      return result;
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
        {this.renderNewCategoryForm()}
        <Switch>
          <Route path="/dashboard/new-goal">
            <NewGoalPage
              category={
                categories.filter(c => {
                  return c.id === Number(selectedCat);
                })[0]
              }
            />
          </Route>
          <Route path="/">
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
            <ul>{this.renderGoals()}</ul>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default DashboardPage;
