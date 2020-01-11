const uuid = require("uuid/v4");
const seperator = require('../helpers/seperator')
const Category = require('./Category')
const Goal = require('./Goal');
const Milestone = require('./Milestone');

module.exports = class User {
  constructor(
    id = uuid(),
    name,
    email,
    email_verified_at,
    password,
    created_at,
    updated_at
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.email_verified_at = email_verified_at;
    this.password = password;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /** Relationship methods */

  withCategories(connection) {
    return new Promise((resolve, reject) => {
      if(this.id) {
        connection.query(`SELECT * FROM categories WHERE user_id = ?`, [this.id], (err, rows) => {
          this.attachCategories(rows)
          resolve(this)
        })
      } else {
        reject(this)
      }
    })
  }

  withGoals(connection) {
    return new Promise(resolve => {
      if (this.id) {
        let query = `
          SELECT c.*, g.id AS g_id, g.name AS g_n, g.description AS g_d,
          g.target AS g_t, g.unit AS g_u, g.deadline AS g_dl,
          g.status AS g_s, g.created_at AS g_c_a, g.updated_at AS g_u_a
          FROM categories AS c
          LEFT JOIN goals AS g ON g.category_id = c.id
          WHERE c.user_id = ?
        `;
        connection.query(query, [this.id], (err, rows) => {
          if(err) throw err
          rows = seperator.catsAndGoals(rows);
          this.attachCategories(rows)
          resolve(this)
        });
      } else {
        reject(this);
      }
    });
  }

  withMilestones(connection) {
    return new Promise(resolve => {
      if (this.id) {
        let query = `
          SELECT c.*,
          m.id AS m_id, m.name AS m_n, m.description AS m_d,
          m.target AS m_t, m.unit AS m_u, m.deadline AS m_dl,
          m.status AS m_s, m.created_at AS m_c_a, m.updated_at AS m_u_a, 
          
          g.id AS g_id, g.category_id AS g_cid, g.name AS g_n, g.description AS g_d,
          g.target AS g_t, g.unit AS g_u, g.deadline AS g_dl,
          g.status AS g_s, g.created_at AS g_c_a, g.updated_at AS g_u_a
          FROM categories AS c
          LEFT JOIN goals AS g ON g.category_id = c.id
          LEFT JOIN milestones AS m ON m.goal_id = g.id
          WHERE c.user_id = ?
        `;
        connection.query(query, [this.id], (err, rows) => {
          if (err) throw err;
          rows = seperator.catsGoalsMilestones(rows)
          this.attachCategories(rows);
          resolve(this);
        });
      } else {
        reject(this);
      }
    });
  }

  /** Attachers */

  attachCategories(rows) {
    rows.forEach((row) => {
      const { name, created_at, updated_at } = row;
      let inst = new Category(null, name, this.id, created_at, updated_at);
      //check if new or existing Category
      if(row.id) inst.id = row.id
      if (row.goals) inst.attachGoals(row.goals);
    })
    this.categories = rows
  }
};
