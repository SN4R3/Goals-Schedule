import React, { Component } from "react";

import NewGoal from "../../forms/NewGoal";

export default class NewGoalPage extends Component {
  render() {
    return (
      <div>
        <h2 className="text-center">New Goal</h2>
        <NewGoal category={this.props.category} />
      </div>
    );
  }
}
