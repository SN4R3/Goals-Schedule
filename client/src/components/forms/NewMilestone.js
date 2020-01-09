import React, { Component } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export class NewMilestone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goal_id: this.props.goal_id ? this.props.goal_id : "",
      name: "Save $1000",
      description: "First Milestone!",
      target: "1000",
      unit: "$",
      deadline: new Date(),
      status: "Not Started"
    };
    this.form = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this)
  }

  handleChange(e) {
    if (e instanceof Date) this.setState({ deadline: e });
    else this.setState({ [e.target.name]: e.target.value });
  }

  submitForm() {
    const { name, target, unit, description, deadline, status } = this.state;
    let valid = true
    
    if (valid) {
      this.props.addMilestone({
        name,
        target,
        unit,
        description,
        deadline: moment(deadline).format(),
        status
      });

      this.setState({
        name: "",
        description: "",
        target: "",
        unit: "",
        deadline: new Date(),
        status: "Not Started"
      });

    }
  }

  render() {
    return (
      <div>

        {/* Name */}
        <label htmlFor="name">
          Name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="name"
          onChange={this.handleChange}
          value={this.state.name}
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

        <div className="text-center">
          <div className="btn btn-success" onClick={this.submitForm}>
            Add Milestone
          </div>
        </div>
      </div>
    );
  }
}

export default NewMilestone;
