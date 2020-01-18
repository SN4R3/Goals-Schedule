const Milestone = require("./Milestone");
const Category = require("./Category");

module.exports = class Goal {
  constructor(
    id = null,
    category_id,
    name,
    description,
    target,
    unit,
    deadline,
    status,
    current_value,
    created_at,
    updated_at
  ) {
    this.id = id;
    this.category_id = category_id;
    this.name = name;
    this.description = description;
    this.target = target;
    this.unit = unit;
    this.deadline = deadline;
    this.status = status;
    this.current_value = current_value;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /** Relationship Methods */

  withMilestones(connection) {
    return new Promise((resolve, reject) => {
      if (this.id) {
        connection.query(
          `SELECT * FROM milestones WHERE goal_id = ?`,
          [this.id],
          (err, rows) => {
            if (err) throw err;
            this.attachMilestones(rows);
            resolve(this);
          }
        );
      } else {
        reject(this);
      }
    });
  }

  withCategory(connection) {
    return new Promise((resolve, reject) => {
      if (this.category_id) {
        connection.query(
          `SELECT * FROM categories WHERE id = ?`,
          [this.category_id],
          (err, rows) => {
            if (err) throw err;
            this.attachCategory(rows[0]);
            resolve(this);
          }
        );
      } else {
        reject(this);
      }
    });
  }

  /** Attaching methods */

  attachMilestones(rows) {
    rows.forEach(row => {
      const {
        name,
        description,
        target,
        unit,
        deadline,
        status,
        created_at,
        updated_at
      } = row;

      let inst = new Milestone(
        null,
        this.id,
        name,
        description,
        target,
        unit,
        deadline,
        status,
        created_at,
        updated_at
      );

      //check if existing or new Milestone
      if (row.id) inst.id = row.id;
      row = inst;
    });
    this.milestones = rows;
  }

  attachCategory(row) {
    const { id, name, user_id, created_at, updated_at } = row
    this.category = new Category(id, name, user_id, created_at, updated_at)
  }
};
