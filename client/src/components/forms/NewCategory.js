import React, { Component } from "react";
import axios from "axios";

export default class NewCategory extends Component {
  constructor() {
    super();
    this.state = {
      name: ""
    };
    this.form = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.submitCategory = this.submitCategory.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitCategory(e) {
    e.preventDefault();
    if (this.form.current.reportValidity()) {
      axios.post("/api/category", { name: this.state.name }).then(res => {
        res.data.goals = [];
        this.props.categoryCreated(res.data);
      });
    }
  }

  render() {
    return (
      <form ref={this.form} onSubmit={this.submitCategory}>
        <div className="input-group mt-1 mb-2">
          <input
            type="text"
            name="newCategoryName"
            value={this.state.name}
            onChange={this.handleChange}
            minLength="2"
            maxLength="255"
            placeholder="Enter new Category Name"
            required
            className="form-control"
          />
          <div className="input-group-append">
            <button className="btn btn-success btn-sm">
              <i className="fa fa-plus"></i> Add
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={(e) => {
                e.preventDefault()
                this.props.cancelNewCategory()
              }}
            >
              <i className="fa fa-times"></i> Cancel
            </button>
          </div>
        </div>
      </form>
    );
  }
}
