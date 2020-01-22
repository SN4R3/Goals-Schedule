import React, { Component } from 'react'
import moment from 'moment'
import axios from 'axios';

export default class UpdatedableList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      goals: [],
      showAll: true,
      sortBy: 'goals',
      editing: null,
    }
    this.handleChange = this.handleChange.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.form = React.createRef()
  }

  handleChange(e) {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    let editing = this.state.editing

    if(e.target.name !== 'current_value')
      this.setState({[e.target.name]: value})
    else {
      editing.current_value = value
      this.setState({editing})
    }
  }

  submitForm(e) {
    e.preventDefault();
    //if(this.form.current.reportValidity()) {
    if(true) {
      let editing = this.state.editing
      axios.put('/api/goal/currentValue', editing).then(res => {
        res.data.milestones = editing.milestones
        this.props.passUpdatedGoal(res.data)
        this.setState({editing: false})
      })
    }
  }

  sortGoals(goals) {
    if(this.state.sortBy === 'goals')
      goals = goals.sort((a, b) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf())
    else {
      goals = goals.filter(g => g.milestones.length)
      goals = goals.sort((a, b) => {
        let toCompareA = null
        let toCompareB = null
        
        a.milestones.forEach((ms) => {
          if(ms.status !== 'Completed' && !toCompareA)
            toCompareA = ms
        })
        b.milestones.forEach((ms) => {
          if(ms.status !== 'Completed' && !toCompareB)
          toCompareB = ms
        })
        return moment(toCompareA.deadline).valueOf() - moment(toCompareB.deadline).valueOf() 
      })
    }
    return goals
  }

  deadlineIn(goal) {
    if(moment(goal.deadline).diff(moment(), 'days') > 0) {
      return moment(goal.deadline).diff(moment(), 'days') + ' Days'
    } else if(moment(goal.deadline).diff(moment(), 'hours') > 0) {
      return moment(goal.deadline).diff(moment(), 'hours') + 'hrs'
    } else if(moment(goal.deadline).diff(moment(), 'minutes') > 0) {
      return moment(goal.deadline).diff(moment(), 'minutes') + 'mins'
    } else {
      return 'Times Up!'
    }
  }



  renderGoals() {
    let { editing, showAll } = this.state
    let goals = []
    this.props.categories.forEach((cat) => {
      cat.goals.forEach((goal) => {
        goals.push(goal)
      })
    });
    return this.sortGoals(goals).map(goal => (
      <div 
        key={`goal${goal.id}`} 
        className={`border p-3 my-3 ${!showAll && goal.status === 'Completed' ? 'd-none' : ''}`} 
        style={{background: '#fff'}}
      >
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 px-1">
          <div className="d-flex align-items-center">
            <div className={`d-none d-sm-block statusBlock ${goal.status.toLowerCase().replace(' ', '')}`}>{goal.status}</div>
            <h3 className="ml-1">{goal.name}</h3>
          </div>
          <button 
            className={`btn btn-sm btn-primary ${editing ? 'd-none' : ''}`}
            onClick={() => this.setState({editing: goal})}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button 
            className={`btn btn-sm btn-danger ${editing ? (editing.id === goal.id ? '' : 'd-none') : 'd-none'}`}
            onClick={() => this.setState({editing: null})}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        {/* Viewing */}
        <div className={`${editing ? (editing.id === goal.id ? 'd-none' : '') : ''}`}>
          <div className="d-flex py-3 justify-content-around" style={{color: '#777777'}}>
            <div className="text-center">
              <i className="fas fa-bullseye"></i> 
              {" "}{goal.current_value}/{goal.target} {goal.unit} 
            </div>
            <div className="text-center">
              <i className="fas fa-stopwatch"></i>{" "}
              {this.deadlineIn(goal)}
            </div>
          </div>
          <h4 className={`${goal.milestones.length ? '' : 'd-none'} p-2`}>
            <i className="fas fa-flag-checkered"></i>  Milestones 
          </h4>
          {goal.milestones.map((ms, i) => (
            <div 
              key={`ms${ms.id}`}
              className={`p-3 border-top ${!showAll && ms.status === 'Completed' ? 'd-none' : ''}`} 
              style={{background: (i % 2 >= 1) ? '#fff' : '#f3f3f3'}}
            >
              <div className="d-flex align-items-center">
                <div className={`statusBlock ${ms.status.toLowerCase().replace(' ', '')}`}>{ms.status}</div>
                <h5 className="ml-1"><strong>{ms.name}</strong></h5>
              </div>
              <div className="d-flex py-2 justify-content-around" style={{color: '#777777'}}>
                <div className="text-center">
                  <i className="fas fa-bullseye"></i> 
                  {" "}{goal.current_value}/{ms.target} {ms.unit} 
                </div>
                <div className="text-center">
                  <i className="fas fa-stopwatch"></i>{" "}
                  {this.deadlineIn(ms)}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Editing */}
        <div className={`${editing ? (editing.id === goal.id ? 'd-block' : 'd-none') : 'd-none'} mt-4`}>
          <form className="text-center my-5" ref={this.form} onSubmit={this.submitForm}>
            <label htmlFor="current_value">Update # of {goal.unit}</label>
            <div className="d-flex justify-content-center">
              <div className="d-flex col-xs-12 col-sm-4">
                <input 
                  type="number" 
                  name="current_value" 
                  value={editing ? editing.current_value : ""}
                  onChange={this.handleChange}
                  minLength="1"
                  maxLength="255"
                  className="form-control"
                />
                <button className="btn btn-success ml-2">Submit</button>
              </div>
            </div>
          </form>
          <div className="text-center mb-2">
            <button className="btn btn-primary" onClick={() => this.props.editGoal(goal)}>
              <i className="fa fa-edit"></i> Edit Goal
            </button>
          </div>
        </div>
      </div>
    ))
  }

  render() {
    let { sortBy, showAll } = this.state
    return (
      <div>
        <div className="row justify-content-center text-center align-items-center my-2 p-3">
          <div className="form-check col-xs-12 col-sm-3 my-2">
            <input 
              type="checkbox" 
              className="form-check-input"
              name="showAll" 
              onChange={this.handleChange} 
              checked={showAll}
            />
            <label htmlFor="showAll" className="form-check-label">Show Completed</label>
          </div>
          <select 
            className="form-control col-xs-12 col-sm-3 my-2" 
            value={sortBy} 
            name="sortBy" 
            onChange={this.handleChange}
          >
            <option value="goals">Sort by Goal Deadlines</option>
            <option value="milestones">Sort by Milestone Deadlines</option>
          </select>
        </div>
        {this.renderGoals()}
      </div>
    )
  }
}
