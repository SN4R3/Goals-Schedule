const Goal = require("./Goal");
const Category = require("./Category");

module.exports = class Milestone {
  constructor(
    id = null,
    goal_id,
    name,
    description,
    target,
    unit,
    deadline,
    status,
    created_at,
    updated_at
  ) {
    this.id = id;
    this.goal_id = goal_id;
    this.name = name;
    this.description = description;
    this.target = target;
    this.unit = unit;
    this.deadline = deadline;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /** Relationship Methods */

  withGoal(connection) {
    return new Promise((resolve, reject) => {
      if (this.goal_id) {
        connection.query(
          `SELECT * FROM goals WHERE id = ?`,
          [this.goal_id],
          (err, rows) => {
            if (err) throw err;
            this.attachGoal(rows[0]);
            resolve(this);
          }
        );
      } else {
        reject(this);
      }
    });
  }

  withGoalCategory(connection) {
    return new Promise((resolve, reject) => {
      if (this.goal_id) {
        if (!this.goal) {
          this.withGoal(connection).then(() => {
            this.fetchGoalCategory(connection).then((row) => {
              this.attachCategory(row)
              resolve(this);
            });
            
          });
        } else {
          this.fetchGoalCategory(connection).then((row) => {
            this.attachCategory(row)
            resolve(this);
          });
        }
      } else {
        reject(this);
      }
    });
  }

  fetchGoalCategory(connection) {
    return new Promise(resolve => {
      connection.query(
        `SELECT * FROM categories WHERE id = ?`,
        [this.goal.category_id],
        (err, rows) => {
          if (err) throw err;
          resolve(rows[0]);
        }
      );
    });
  }

  /** Attaching methods */

  attachGoal(row) {
    const {
      category_id,
      name,
      description,
      target,
      unit,
      deadline,
      status,
      created_at,
      updated_at
    } = row;

    let inst = new Goal(
      null,
      category_id,
      name,
      description,
      target,
      unit,
      deadline,
      status,
      created_at,
      updated_at
    );
    //check if existing or new Goal
    if (row.id) inst.id = row.id;
    this.goal = inst;
  }

  attachCategory(row) {
    const { id, name, user_id, created_at, updated_at } = row;
    this.category = new Category(id, name, user_id, created_at, updated_at);
  }
};
