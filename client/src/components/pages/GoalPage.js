import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import Goal from '../forms/Goal'

export class GoalPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      triggerSubmit: false,
      attachMilestones: null,
      goal:
       this.props.goal ? this.props.goal :
        {
          category_id: this.props.match.params.catId,
          goal_id: null,
          name: "",
          description: "",
          target: "",
          unit: "",
          deadline: new Date(),
          status: "Not Started",
          current_value: 0,
          milestones: [],
        },
    }

    this.renderOpBtn = this.renderOpBtn.bind(this)
  }

  clearState() {
    this.setState({
      goal:
      {
        category_id: this.props.match.params.catId,
        goal_id: null,
        name: "",
        description: "",
        target: "",
        unit: "",
        deadline: new Date(),
        status: "Not Started",
        current_value: 0,
        milestones: [],
      },
    })
  }

  triggerSubmit() {
    let self = this
    this.setState({triggerSubmit:true})
    setTimeout(() => {self.setState({triggerSubmit:false})}, 100)
  }

  renderOpBtn() {
    if(!this.props.goal) {
      return (
        <button className="btn btn-success btn-sm" onClick={() => this.triggerSubmit()}>
          <i className="fa fa-plus"></i> Submit Goal
        </button>
      )
    } else if(this.props.edit) {
      return (
        <div>
          <button className="btn btn-success btn-sm mr-1" onClick={() => this.triggerSubmit()}>
            <i className="fa fa-check"></i> Update
          </button>
          <button className="btn btn-danger btn-sm" onClick={this.props.toggleEdit}>
            <i className="fa fa-times"></i> Cancel
          </button>
        </div>
      )
    } else {
      return (
        <button className="btn btn-info btn-sm" onClick={this.props.toggleEdit}>
          <i className="fa fa-edit"></i> Edit
        </button>
      )
    }
  }

  render() {
    let { categories, edit } = this.props
    let { goal } = this.state
    return (
      <div>
        <div className="border d-flex justify-content-between align-items-center px-3 py-4" style={{background:'#fff'}}>
          <h3><i className="fas fa-flag-checkered"></i> {this.props.goal ? this.props.goal.name : 'New Goal'}</h3>
          {this.renderOpBtn()}
        </div>
        <div className="m-2 px-3 py-3 border" style={{background:'#fff'}}>
          <Goal 
            goal={goal} 
            categories={categories}
            edit={edit}
            triggerSubmit={this.state.triggerSubmit}
            clearState={() => this.clearState}
            passNewGoal={(goal) => this.props.passNewGoal(goal)}
            passUpdatedGoal={(goal) => this.props.passUpdatedGoal(goal)}
          />
        </div>
      </div>
    )
  }
}

export default withRouter(GoalPage)
