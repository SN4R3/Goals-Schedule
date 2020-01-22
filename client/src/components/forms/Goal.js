import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withRouter, Redirect } from 'react-router-dom';

import Milestone from './Milestone'
import uuid from 'uuid';

export class Goal extends Component {
  constructor(props) {
    super(props)
    let { category_id } = this.props.goal
    let goal = this.props.goal
    goal.category_id = category_id ? category_id : this.props.match.params.catId

    this.state = {
      goal,
      addingMilestone: false,
      redirector: null,
    };

    this.form = React.createRef();
    this.submitBtn = React.createRef();
    
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addMilestone = this.addMilestone.bind(this);
    this.addUpdateMilestone = this.addUpdateMilestone.bind(this)
    this.removeMilestone = this.removeMilestone.bind(this)
  }

  componentDidUpdate(prevProps) {
    if(!prevProps.triggerSubmit && this.props.triggerSubmit) {
      this.submitBtn.current.click()
    }
  }

  handleChange(e) {
    let goal = this.state.goal
    if (e instanceof Date) {
      goal.deadline = e
    } else {
      goal[e.target.name] = e.target.value
    }
    this.setState({ goal });
  }

  addMilestone() {
    let goal = this.state.goal
    goal.milestones = [...goal.milestones, {
      category_id: '',
      goal_id: this.props.goal ? this.props.goal.id : null,
      name: "",
      description: "",
      target: "",
      unit: "",
      deadline: new Date(),
      status: "Not Started"
    }]
    this.setState({ goal, addingMilestone: true });
  }

  addUpdateMilestone(ms, i) {
    let goal = this.state.goal
    goal.milestones.forEach((milestone, j) => {
      if(i === j) {
        if(ms.goal_id) {
          if(ms.id) {
            //existing milestone, existing goal
            axios.put('/api/milestone', ms).then(res => {
              goal.milestones[i] = res.data
              this.setState({ goal, addingMilestone:false })
            })
          } else {
            //new milestone in existing goal
            axios.post('/api/milestone', ms).then(res => {
              goal.milestones[i] = res.data
              this.setState({ goal, addingMilestone:false })
            })
          }
        } else if(ms.id) {
          //existing milestone in a new goal
          goal.milestones[i] = ms;
          this.setState({ goal, addingMilestone:false })
        } else {
          //new milestone in new goal
          ms.id = uuid.v4()
          milestone = ms
          this.setState({ goal, addingMilestone:false })
        }
      }
    })
  }

  removeMilestone(i) {
    let goal = this.state.goal;
    let milestone = goal.milestones[i]
    if(milestone.goal_id) {
      if(window.confirm('Are you sure you want to remove this Milestone? This action cannot be undone.')) {
        axios.delete(`/api/milestone/${milestone.id}`).then(res => {
          goal.milestones.splice(i, 1)
          this.setState({ goal });
        })
      }
    } else {
      goal.milestones.splice(i, 1)
      this.setState({ goal });
    }
  }

  submitForm(e) {
    e.preventDefault();
    if(this.form.current.reportValidity()) {
      let goal = JSON.parse(JSON.stringify(this.state.goal))

      this.props.clearState()
      goal.deadline = moment(goal.deadline).format();
      goal.milestones = goal.milestones.filter(ms => ms.id)
      goal.milestones = JSON.stringify(goal.milestones)
      if(goal.id) {
        //update
        axios.put("/api/goal", goal).then(res => {
          res.data.deadline = moment(res.data.deadline).toDate()
          this.props.passUpdatedGoal(res.data)
          let self = this
          this.setState({redirector: <Redirect to="/user"/>})
          setTimeout(() => {
            self.setState({redirector: null})
          }, 100)
        });
      } else {
        //create new
        axios.post("/api/goal", goal).then(res => {
          this.props.passNewGoal(res.data)
          let self = this
          this.setState({redirector: <Redirect to="/user"/>})
          setTimeout(() => {
            self.setState({redirector: null})
          }, 100)
        });
      }
    }
  }

  renderMilestones() {
    let res = <React.Fragment/>
    res = this.state.goal.milestones.map((ms, i) => 
      <div key={`ms${ms.id ? ms.id : i}`} className="border-bottom my-5 pb-5">
        <Milestone 
          milestone={ms}
          addUpdateMilestone={(newMs) => this.addUpdateMilestone(newMs, i)}
          removeMilestone={() => this.removeMilestone(i)}
          edit={this.state.addingMilestone}
        /> 
      </div>
    );

    if(!this.state.goal.milestones.length) {
      res = 
        <div className="text-center p-4" style={{color:'rgb(189, 183, 183)'}}>
          <i className="far fa-sad-cry" style={{fontSize:'35px'}}></i>
          <h4>Nothing to see here!</h4>
          <p><small>Try creating a new Milestone.</small></p>
        </div>
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
      status,
      current_value,
    } = this.state.goal
    return (
      <div>
        <form ref={this.form} onSubmit={this.submitForm}>    
          <button type="submit" style={{visibility:'hidden'}} ref={this.submitBtn} onClick={() => this.submitForm}></button>
          <div className="d-flex">
            <i className="fa fa-signal mr-1"></i> Status:
            <div className={`ml-1 statusBlock ${status.toLowerCase().replace(' ', '')}`}>
              {status}
            </div>
          </div>
          <div className="form-row my-3">
            {/* Name */}
            <div className={`form-group col-xs-12 col-sm-6`}>
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
            {/* Current value */}
            <div className={`form-group col-xs-12 col-sm-3`}>
              <label htmlFor="current_value">
                <i className="fas fa-flag-checkered"></i> Current Value <span style={{ color: "red" }}>*</span>
              </label>
              <input 
                type="number" 
                name="current_value"
                minLength="1"
                maxLength="255"
                required
                value={current_value} 
                onChange={this.handleChange} 
                className="form-control"
                readOnly={!edit}
              />
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
        </form>

        <div className="d-flex justify-content-between align-items-center border-bottom my-5 pb-3">
          <h4><i className="fas fa-flag-checkered"></i> Milestones</h4>
          <div 
            className={`btn btn-success btn-sm ${this.state.addingMilestone || !edit ? 'd-none' : ''}`} 
            onClick={this.addMilestone}
          >
            <i className="fa fa-plus"></i> New Milestone
          </div>
        </div>

        <div className="px-4">
          {this.renderMilestones()}
        </div>

        {this.state.redirector}
      </div>
    )
  }
}

export default withRouter(Goal)
