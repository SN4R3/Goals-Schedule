const express = require("express");
const router = express.Router();
const connection = require("../connection");
const Category = require('../models/Category')


router.get('/user', (req, res) => {
  let userId = req.session.userId;
  connection.query(`SELECT * FROM categories WHERE user_id = ?`, [userId], (err, rows) => {
    if(err) throw err

    let outstanding = rows.length
    let payload = []
    rows.forEach((row) => {
      const { id, name, user_id, created_at, updated_at } = row
      let cat = new Category(id, name, user_id, created_at, updated_at)

      cat.withMilestones(connection).then(() => {
        payload.push(cat)
        outstanding--;
        if(!outstanding)
          res.json(payload)
      })
    })

    if(!outstanding) {
      res.json([]);
    }

  })
});

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

router.delete('/:id', (req, res) => {
  connection.query('DELETE FROM goals WHERE id = ?', [req.params.id], (err, r) => {
    if(err) throw err
    connection.query('DELETE FROM milestones WHERE goal_id = ?', [req.params.id], (err2, result) => {
      if(err2) throw err2
      res.sendStatus(200)
    })
  })
})

module.exports = router;
