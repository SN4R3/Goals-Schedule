import React, { Component } from 'react'
import moment from 'moment'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withRouter } from 'react-router-dom';

export class milestone extends Component {
  constructor(props) {
    super(props)

    let { goal_id } = this.props.milestone
    let milestone = this.props.milestone

    milestone.goal_id = goal_id ? goal_id : null
    this.state = { milestone: milestone };

    this.form = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  handleChange(e) {
    let milestone = this.state.milestone
    if (e instanceof Date) {
      milestone.deadline = e
    } else {
      milestone[e.target.name] = e.target.value
    }
    this.setState({ milestone });
  }

  submitForm(e) {
    e.preventDefault();
    let milestone = this.state.milestone;
    if(this.form.current.reportValidity()) {
      milestone.deadline = moment(milestone.deadline).format();
      this.props.addUpdateMilestone(milestone)
    }
  }

  render() {
    let { edit } = this.props
    let { 
      id,
      name,
      target,
      unit,
      description,
      deadline,
      status } = this.state.milestone
    return (
      <div>
        <form ref={this.form} onSubmit={this.submitForm}>    
          <div className="form-row my-3">
            {/* Name */}
            <div className={`form-group col-12`}>
              <label htmlFor="name">
                <i className="fas fa-flag-checkered"></i> Name <span style={{ color: "red" }}>*</span>
              </label>
              <input 
                type="text" 
                name="name"
                minLength="2"
                maxLength="255"
                required
                value={name} 
                onChange={this.handleChange} 
                className="form-control"
                readOnly={!edit}
              />
            </div>
          </div>

          <div className="form-row my-3">
            {/* Unit */}
            <div className="form-group col-xs-12 col-sm-3">
              <label htmlFor="unit">
                <i className="fas fa-bullseye"></i> Unit of Measure <span style={{ color: "red" }}>*</span>
              </label>
              <input 
                type="text" 
                value={unit} 
                onChange={this.handleChange}
                minLength="1"
                maxLength="255"
                required
                name="unit" 
                className="form-control"
                readOnly={!edit}
              />  
            </div>
            {/* Target */}
            <div className="form-group col-xs-12 col-sm-3">
              <label htmlFor="target">
                <i className="fas fa-bullseye"></i> Target <span style={{ color: "red" }}>*</span>
              </label>
              <input 
                type="text" 
                name="target" 
                minLength="1"
                maxLength="255"
                required
                value={target} 
                onChange={this.handleChange} 
                className="form-control"
                readOnly={!edit}
              />
            </div>
            {/* Status */}
            <div className="form-group col-xs-12 col-sm-3">
              <label htmlFor="status">
                <i className="fas fa-signal"></i> Status
              </label>
              <select 
                name="status" 
                value={status} 
                onChange={this.handleChange} 
                className="form-control"
                readOnly={!edit}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            {/* Deadline */}
            <div className="form-group col-xs-12 col-sm-3" style={{position:'unset'}}>
              <label htmlFor="deadline" style={{display:'block'}}>
                <i className="fas fa-stopwatch"></i> Deadline <span style={{ color: "red" }}>*</span>
              </label>
              <DatePicker
                onChange={this.handleChange}
                showTimeSelect
                selected={moment(deadline).toDate()}
                minDate={new Date()}
                dateFormat="Pp"
                className="form-control"
                readOnly={!edit}
              />
            </div>
          </div>              
          <div className="form-row my-3">
            {/* Description */}
            <div className="form-group col-12">
              <label htmlFor="description">
                <i className="far fa-comment-alt"></i> Description
              </label>
              <textarea
                name="description"
                cols="30"
                rows="5"
                minLength="2"
                maxLength="255"
                onChange={this.handleChange}
                value={description}
                className="form-control"
                readOnly={!edit}
              />
            </div>
          </div>
          <div className={`justify-content-around align-items-center ${!edit ? 'd-none' : 'd-flex'}`}>
            <button className={`btn btn-success btn-sm`}>
              <i className={`fa fa-${id ? 'check' : 'plus'}`}></i> {id ? 'Update' : 'Add'}
            </button>
            <div className={`btn btn-danger btn-sm ${!id ? 'd-none' : ''}`}  onClick={() => this.props.removeMilestone(id)}>
              <i className="fa fa-times"></i> Remove
            </div>
        </div>
        </form>
      </div>
    )
  }
}

export default withRouter(milestone)
