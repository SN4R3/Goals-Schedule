import React, { Component } from 'react'

import GoalMilestone from '../forms/GoalMilestone'

export class GoalPage extends Component {
  constructor() {
    super()
    this.state = {
      triggerSubmit: false,
    }
    this.renderOpBtn = this.renderOpBtn.bind(this)
  }

  triggerSubmit() {
    this.setState({triggerSubmit:true})
    this.setState({triggerSubmit:false})
  }

  renderOpBtn() {
    if(this.props.edit) { 
      return (
        <button className="btn btn-danger btn-sm" onClick={this.props.toggleEdit}>
          <i className="fa fa-times"></i> Cancel Editing
        </button>
      )
    } else if(!this.props.goal) {
      return (
        <button className="btn btn-success btn-sm" onClick={() => this.triggerSubmit()}>
          <i className="fa fa-plus"></i> Submit Goal
        </button>
      )
    } else {
      return (
        <button className="btn btn-info btn-sm" onClick={this.props.toggleEdit}>
          <i className="fa fa-edit"></i> Edit
        </button>
      )
    }
  }

  renderMilestones() {
    let res = <React.Fragment/>
    if(this.props.goal) {
      res = this.props.goal.milestones.map(ms => 
        <div key={`ms${ms.id}`} className="border-bottom my-5 pb-5">
          <GoalMilestone 
            goalMilestone={ms} 
            categories={[]} 
            edit={this.props.edit}
          /> 
        </div>
      );

      if(!this.props.goal.milestones.length) {
        res = 
          <div className="text-center p-4" style={{color:'rgb(189, 183, 183)'}}>
            <i className="far fa-sad-cry" style={{fontSize:'35px'}}></i>
            <h4>Nothing to see here!</h4>
            <p><small>Try creating a new Milestone.</small></p>
          </div>
      }
    }
    return res
  }

  render() {
    let { goal, categories, edit } = this.props
    return (
      <div>
        <div className="border d-flex justify-content-between align-items-center px-3 py-4" style={{background:'#fff'}}>
          <h3><i className="fas fa-flag-checkered"></i> {goal ? goal.name : 'New Goal'}</h3>
          {this.renderOpBtn()}
        </div>
        <div className="m-2 px-5 py-3 border" style={{background:'#fff'}}>
          <GoalMilestone 
            goalMilestone={goal} 
            categories={categories} 
            edit={edit}
            triggerSubmit={this.state.triggerSubmit}
          />
          <div className="d-flex justify-content-between align-items-center border-bottom my-5 pb-3">
            <h4><i className="fas fa-flag-checkered"></i> Milestones</h4>
            <div className="btn btn-success btn-sm">
              <i className="fa fa-plus"></i> New Milestone
            </div>
          </div>
          
          <div className="px-4">
            {this.renderMilestones()}
          </div>

        </div>
      </div>
    )
  }
}

export default GoalPage
