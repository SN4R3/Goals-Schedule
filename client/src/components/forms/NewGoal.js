import React, { Component } from "react";
import axios from "axios";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import NewMilestone from "./NewMilestone";

export default class NewGoal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      category_id: this.props.category ? this.props.category.id : "",
      name: "Buy a New Car",
      description: "Save dat muneh",
      target: "5000",
      unit: "$",
      deadline: new Date(),
      status: "Not Started",
      milestones: [],
      newMilestone: false
    };

    this.form = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.addMilestone = this.addMilestone.bind(this);
  }

  componentDidMount() {
    axios.get("/api/goal/all/withCategories").then(res => {
      this.setState({ categories: res.data });
      if (!this.state.category_id)
        this.setState({ category_id: res.data[0].id });
    });
  }

  handleChange(e) {
    if (e instanceof Date) this.setState({ deadline: e });
    else this.setState({ [e.target.name]: e.target.value });
  }

  submitForm(e) {
    e.preventDefault();
    const {
      name,
      category_id,
      target,
      unit,
      description,
      deadline,
      status,
      milestones
    } = this.state;
    if (this.form.current.reportValidity()) {
      axios
        .post("/api/goal", {
          name,
          category_id,
          target,
          unit,
          description,
          deadline: moment(deadline).format(),
          status,
          milestones: JSON.stringify(milestones)
        })
        .then(res => {
          //window.location.href = "/user/dashboard";
        });
    }
  }

  addMilestone(milestone) {
    this.setState({
      milestones: [...this.state.milestones, milestone],
      newMilestone: false
    });
  }

  removeMilestone(i) {
    let milestones = this.state.milestones;
    milestones.splice(i, 1);
    this.setState({ milestones });
  }

  render() {
    return (
      <div>
        <form ref={this.form} onSubmit={this.submitForm}>
          {/* Category */}
          <label htmlFor="category">Category</label>
          <select
            name="category_id"
            value={this.state.category_id}
            onChange={this.handleChange}
            className="custom-select mb-4"
          >
            {this.state.categories.map(cat => (
              <option key={`catopt${cat.id}`} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {/* Name */}
          <label htmlFor="name">
            Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            onChange={this.handleChange}
            value={this.state.name}
            minLength="2"
            maxLength="255"
            required
            className="form-control mb-4"
          />
          {/* Target */}
          <label htmlFor="target">
            Target <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="target"
            onChange={this.handleChange}
            value={this.state.target}
            minLength="1"
            maxLength="255"
            required
            className="form-control mb-4"
          />
          {/* Unit */}
          <label htmlFor="unit">Unit of Measure</label>
          <input
            type="text"
            name="unit"
            onChange={this.handleChange}
            value={this.state.unit}
            placeholder="eg. kgs, $, push-ups"
            className="form-control mb-4"
          />
          {/* Description */}
          <label htmlFor="description"> Description</label>
          <textarea
            name="description"
            minLength="2"
            maxLength="255"
            cols="30"
            rows="10"
            onChange={this.handleChange}
            value={this.state.description}
            className="form-control mb-4"
          ></textarea>
          {/* Deadline */}
          <label htmlFor="deadline">
            Deadline <span style={{ color: "red" }}>*</span>
          </label>
          <div className="mb-4">
            <DatePicker
              onChange={this.handleChange}
              showTimeSelect
              selected={this.state.deadline}
              dateFormat="Pp"
              className="form-control"
            />
          </div>
          {/* Status */}
          <label htmlFor="status">Status</label>
          <select
            name="status"
            className="custom-select mb-4"
            onChange={this.handleChange}
            value={this.state.status}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <hr />
          <h4>Milestones</h4>
          {/* New Milestones */}
          <ul>
            {this.state.milestones.map((milestone, i) => (
              <li key={`milestone-${i}`}>
                {milestone.name} -{" "}
                <i
                  className="fas fa-minus-circle"
                  style={{ color: "#bd2130" }}
                  onClick={() => this.removeMilestone(i)}
                ></i>
              </li>
            ))}
          </ul>

          {/* New Milestone */}
          <div
            onClick={() => this.setState({ newMilestone: true })}
            className={`mb-4 btn btn-sm btn-secondary ${
              this.state.newMilestone ? "d-none" : "m-4"
            }`}
          >
            Add New Milestone
          </div>
          <div
            style={newMilestone}
            className={`${this.state.newMilestone ? "p-4" : "d-none"}`}
          >
            <NewMilestone addMilestone={this.addMilestone} />
          </div>
          <hr />
          <div className="text-center">
            <button type="submit" className="btn btn-success">
              Submit Goal
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const newMilestone = {
  backgroundColor: "#f1f1f1",
  borderRadius: "5px"
};
