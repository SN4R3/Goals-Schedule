const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.post("/", (req, res) => {
  let {
    name,
    category_id,
    description,
    target,
    unit,
    deadline,
    status,
    milestones
  } = req.body;
  const query = `
    INSERT INTO goals (name, category_id, description, target, unit, deadline, status)
    VALUES (?,?,?,?,?,?,?)
  `;
  connection.query(
    query,
    [name, category_id, description, target, unit, deadline, status],
    (err, result) => {
      if (err) throw err;
      connection.query(
        "SELECT * FROM goals WHERE id = ?",
        [result.insertId],
        (err, rows) => {
          if (err) throw err;
          let goal = rows[0];
          milestones = JSON.parse(milestones)
          if (milestones.length) {
            // store milestone(s)
            let outstanding = milestones.length;
            const goal_id = result.insertId;

            milestones.forEach(milestone => {
              const {
                name,
                description,
                target,
                unit,
                deadline,
                status
              } = milestone;
              const query = `
                INSERT INTO milestones (goal_id, name, description, target, unit, deadline, status)
                VALUES (?,?,?,?,?,?,?)
              `;
              connection.query(
                query,
                [goal_id, name, description, target, unit, deadline, status],
                (err, result) => {
                  if (err) throw err;

                  outstanding--;
                  if (!outstanding) {
                    //return stored goal with stored milestones
                    connection.query(
                      `SELECT * FROM milestones WHERE goal_id = ?`,
                      [goal_id],
                      (err, rows) => {
                        goal.milestones = rows;
                        res.json(goal);
                      }
                    );
                  }
                }
              );
            });
          } else {
            res.json(goal);
          }
        }
      );
    }
  );
});

router.get("/all/withCategories", (req, res) => {
  let userId = req.session.userId;
  let query = `
    SELECT c.*, 
    g.id AS goal_id, g.name AS goal_name, g.category_id, g.description, g.target, g.unit, g.deadline, g.status, g.created_at
    FROM categories AS c
    LEFT JOIN goals AS g ON c.id = g.category_id
    WHERE c.user_id = ?
  `;
  connection.query(query, [userId], (err, rows) => {
    if (err) throw err;
    //map results
    let mapped = [];
    rows.forEach(row => {
      let goal = {
        id: row.goal_id,
        name: row.goal_name,
        target: row.target,
        unit: row.unit,
        category_id: row.category_id,
        description: row.description,
        deadline: row.deadline,
        status: row.status,
        created_at: row.created_at
      };
      let cat = {
        id: row.id,
        name: row.name,
        goals: []
      };
      if (goal.id) cat.goals.push(goal);
      exists = false;
      mapped.forEach(existing => {
        if (existing.id == row.id) {
          if (goal.id) existing.goals.push(goal);
          exists = true;
        }
      });
      if (!exists) mapped.push(cat);
    });

    res.json(mapped);
  });
});

module.exports = router;
