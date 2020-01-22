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
    this.state = { milestone: milestone, edit: this.props.edit };

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
      this.setState({edit: false})
    }
  }

  deadlineIn() {
    let { deadline } = this.state.deadline
    if(moment(deadline).diff(moment(), 'days') > 0) {
      return moment(deadline).diff(moment(), 'days') + ' Days'
    } else if(moment(deadline).diff(moment(), 'hours') > 0) {
      return moment(deadline).diff(moment(), 'hours') + 'hrs'
    } else if(moment(deadline).diff(moment(), 'minutes') > 0) {
      return moment(deadline).diff(moment(), 'minutes') + 'mins'
    } else {
      return 'Times Up!'
    }
  }


  render() {
    let { edit } = this.state
    let { goal_id } = this.props.milestone
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
        <div className="d-flex">
          <i className="fa fa-signal mr-1"></i> Status:
          <div className={`ml-1 statusBlock ${status.toLowerCase().replace(' ', '')}`}>
            {status}
          </div>
        </div>
        <div className={`${edit ? 'd-none' : 'mt-2'}`}>
          <div className={`p-3 border-top`} >
            <div className="d-flex py-2 justify-content-around" style={{color: '#777777'}}>
              <div className="text-center">
                {name}
              </div>
              <div className="text-center">
                <i className="fas fa-bullseye"></i> 
                {" "}{target} {unit} 
              </div>
              <div className="text-center">
                <i className="fas fa-stopwatch"></i>{" "}
                {moment(deadline).format('DD/MM/YYYY')}
              </div>
            </div>
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={() => this.setState({edit: true})}>
              <i className="fa fa-edit"></i> Edit
            </button>
          </div>
        </div>
        <form className={`${!edit ? 'd-none' : ''}`} ref={this.form} onSubmit={this.submitForm}>    
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
            <div className="form-group col-xs-12 col-sm-4">
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
            <div className="form-group col-xs-12 col-sm-4">
              <label htmlFor="target">
                <i className="fas fa-bullseye"></i> Target <span style={{ color: "red" }}>*</span>
              </label>
              <input 
                type="number" 
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
            {/* Deadline */}
            <div className="form-group col-xs-12 col-sm-4" style={{position:'unset'}}>
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
            <button className={`${(edit || !goal_id) ? '' : 'd-none'} btn btn-success btn-sm`}>
              <i className={`fa fa-${id ? 'check' : 'plus'}`}></i>{" "}
              {id ? 'Update' : 'Add'}
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
