import React, { Component } from "react";
import './GoalList.css'
import axios from 'axios'

export default class GoalsList extends Component {
  constructor() {
    super()
    this.state = {
      selected: null,
    }
  }

  deleteGoal() {
    if (window.confirm(`Are you sure you want to delete ${this.state.selected.name}? All it's Milestones will also be deleted.`)) {
      axios.delete(`/api/goal/${this.state.selected.id}`).then(resp => {
        this.props.goalDeleted(this.state.selected.id)
      })
    }
  }

  render() {
    return (
      <div className="border px-2 py-4" style={listContainer}>
        {
          this.props.goals.length ? 
            this.props.goals.map(goal => (
              <div className="p-2 my-1" key={`goal${goal.id}`}>
                <div className="py-2 px-1 d-flex align-items-center" onClick={() => {this.setState({selected:goal})}}>
                  <div className={`statusBlock ${goal.status.toLowerCase().replace(' ', '')}`}>{goal.status}</div>
                  <h4 className="ml-2">{goal.name}</h4>
                </div>
                <div className="d-flex border-top py-3 justify-content-around" style={{color: '#777777'}}>
                  <div className="text-center"><i className="fas fa-bullseye"></i> {goal.unit} {goal.target}</div>
                  <div className="text-center"><i className="fas fa-flag-checkered"></i> 0/5 Milestones</div>
                  <div className="text-center"><i className="fas fa-stopwatch"></i> 6 Months</div>
                </div>
                <div
                  onClick={() => {
                    this.setState({selected: goal})
                  }}
                  className={`
                    text-right point 
                    ${this.state.selected && goal.id === this.state.selected.id ? 'd-none' : ''}
                  `}>
                  <a style={{color: '#007bff'}}>More <i className="fa fa-caret-down"></i></a>
                </div>
                <div className={`${this.state.selected && goal.id === this.state.selected.id ? 'd-block' : 'd-none'}`}>
                  <div>
                    <div className="px-2 py-3 my-3 border">
                      <i className="far fa-comment-alt" style={{color: '#777777'}}></i> 
                      {" "}{goal.description}
                    </div>
                    <p><strong>Set on: </strong>{goal.created_at}</p>
                    <p><strong>Deadline: </strong>{goal.deadline}</p>
                    <button onClick={() => this.props.viewGoal(goal)} className="btn btn-sm btn-light">
                      <i className="fas fa-flag-checkered"></i> 
                      {" "}See Milestones
                    </button>
                  </div>

                  <div className="goalOps py-3 border-bottom">
                    <button onClick={() => this.props.editGoal(goal)} className="btn btn-sm btn-primary">
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => this.deleteGoal()}
                    >
                      <i className="fas fa-trash"></i> Delete 
                    </button>
                  </div>
                </div>
              </div>
            ))
          : <div className="text-center p-4" style={{color:'rgb(189, 183, 183)'}}>
              <i className="far fa-sad-cry" style={{fontSize:'35px'}}></i>
              <h4>Nothing to see here!</h4>
              <p><small>Try creating a new Category or Goal.</small></p>
            </div>
        }
      </div>
    );
  }
}

const listContainer = {
  background: 'white'
}