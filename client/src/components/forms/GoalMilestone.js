import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export class GoalMilestone extends Component {
  constructor(props) {
    super(props)

    this.state = {
      category_id: this.props.goalMilestone ? this.props.goalMilestone.category_id : "",
      name: this.props.goalMilestone ? this.props.goalMilestone.name : "",
      description: this.props.goalMilestone ? this.props.goalMilestone.description : "",
      target: this.props.goalMilestone ? this.props.goalMilestone.target : "",
      unit: this.props.goalMilestone ? this.props.goalMilestone.unit : "",
      deadline: this.props.goalMilestone ? moment(this.props.goalMilestone.deadline).toDate() : new Date(),
      status: this.props.goalMilestone ? this.props.goalMilestone.status : "Not Started",
      milestones: this.props.goalMilestone ? this.props.goalMilestone.milestones : [],
    };
    this.form = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.addMilestone = this.addMilestone.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    if (e instanceof Date) this.setState({ deadline: e });
    else this.setState({ [e.target.name]: e.target.value });
  }

  componentDidUpdate(prevProps) {
    if(!prevProps.triggerSubmit && this.props.triggerSubmit) {
      this.form.submit()
    }
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
    if(this.form.current.reportValidity()) {
      axios.post("/api/goal", {
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

  getCategoryName() {
    let res = ''
    if(this.state.category_id) {
      this.props.categories.forEach((cat) => {
        if(cat.id === this.state.category_id) {
          res = cat.name
        }
      })
    }
    return res
  }

  render() {
    let { categories, edit } = this.props
    let { 
      name,
      category_id,
      target,
      unit,
      description,
      deadline,
      status } = this.state
    return (
      <div>
        <form ref={this.form} onSubmit={this.submitForm}>      
          <div className="form-row my-3">
            {/* Name */}
            <div className={`form-group ${categories.length ? 'col-xs-12 col-sm-6' : 'col-12'}`}>
              <label htmlFor="name">
                <i className="fas fa-flag-checkered"></i> Name
              </label>
              <input 
                type="text" 
                name="name"
                value={name} 
                onChange={this.handleChange} 
                className="form-control"
                readOnly={!edit}
              />
            </div>
            {/* Category */}
            <div className={`form-group col-xs-12 col-sm-6 ${!categories.length ? 'd-none' : ''}`}>
              <label htmlFor="category_id">
                <i className="fas fa-shapes"></i> Category 
              </label>
              <select 
                name="category_id" 
                value={category_id} 
                onChange={this.handleChange} 
                className="form-control"
                readOnly={!edit}
              >
                {
                  categories.map(cat => (
                    <option value={cat.id} key={`cat${cat.id}`}>{cat.name}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <div className="form-row my-3">
            {/* Unit */}
            <div className="form-group col-xs-12 col-sm-3">
              <label htmlFor="unit">
                <i className="fas fa-bullseye"></i> Unit
              </label>
              <input 
                type="text" 
                value={unit} 
                onChange={this.handleChange} 
                name="unit" 
                className="form-control"
                readOnly={!edit}
              />  
            </div>
            {/* Target */}
            <div className="form-group col-xs-12 col-sm-3">
              <label htmlFor="target">
                <i className="fas fa-bullseye"></i> Target
              </label>
              <input 
                type="text" 
                name="target" 
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
                <i className="fas fa-stopwatch"></i> Deadline
              </label>
              <DatePicker
                onChange={this.handleChange}
                showTimeSelect
                selected={deadline}
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
                onChange={this.handleChange}
                value={description}
                className="form-control"
                readOnly={!edit}
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default GoalMilestone
