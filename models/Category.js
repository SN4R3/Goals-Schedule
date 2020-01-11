const Goal = require("../models/Goal");
const seperator = require('../helpers/seperator')

module.exports = class Category {
  constructor(id = null, name, user_id, created_at, updated_at) {
    this.id = id;
    this.name = name;
    this.user_id = user_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /** Relationship Methods */

  withGoals(connection) {
    return new Promise((resolve, reject) => {
      if (this.id) {
        connection.query(
          `SELECT * FROM goals WHERE category_id = ?`,
          [this.id],
          (err, rows) => {
            if (err) throw err;
            this.attachGoals(rows);
            resolve(this);
          }
        );
      } else {
        reject(this);
      }
    });
  }

  withMilestones(connection) {
    return new Promise(resolve => {
      if (this.id) {
        let query = `
          SELECT m.id AS m_id, m.name AS m_n, m.description AS m_d,
          m.target AS m_t, m.unit AS m_u, m.deadline AS m_dl,
          m.status AS m_s, m.created_at AS m_c_a, m.updated_at AS m_u_a, 
          
          g.id AS g_id, g.category_id AS g_cid, g.name AS g_n, g.description AS g_d,
          g.target AS g_t, g.unit AS g_u, g.deadline AS g_dl,
          g.status AS g_s, g.created_at AS g_c_a, g.updated_at AS g_u_a
          FROM goals AS g
          LEFT JOIN milestones AS m ON m.goal_id = g.id
          WHERE g.category_id = ?
        `;
        connection.query(query, [this.id], (err, rows) => {
          if (err) throw err;
          rows = seperator.goalsAndMilestones(rows);
          this.attachGoals(rows);
          resolve(this);
        });
      } else {
        reject(this);
      }
    });
  }

  withUser(connection) {
    return new Promise((resolve, reject) => {
      if (this.id) {
        connection.query(
          `SELECT * FROM users WHERE id = ?`,
          [this.user_id],
          (err, rows) => {
            if (err) throw err;
            this.user = rows[0];
            resolve(this);
          }
        );
      } else {
        reject(this);
      }
    });
  }

  /** Attaching methods */

  attachGoals(rows) {
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

      let inst = new Goal(
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

      //check if existing or new Goal
      if (row.id) inst.id = row.id;
      if (row.milestones) inst.attachMilestones(row.milestones);
      row = inst;
    });
    this.goals = rows;
  }
};
