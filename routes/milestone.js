const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.post("/", (req, res) => {
  let {
    name,
    goal_id,
    description,
    target,
    unit,
    deadline,
    status,
  } = req.body;
  const query = `
    INSERT INTO milestones (name, goal_id, description, target, unit, deadline, status)
    VALUES (?,?,?,?,?,?,?)
  `;
  connection.query(
    query,
    [name, goal_id, description, target, unit, deadline, status],
    (err, result) => {
      if (err) throw err;
      connection.query(
        "SELECT * FROM milestones WHERE id = ?",
        [result.insertId],
        (err, rows) => {
          if (err) throw err;
          res.json(rows[0]);
        }
      );
    }
  );
});

router.put('/', (req, res) => {
  let {
    id,
    name,
    description,
    target,
    unit,
    deadline,
    status,
  } = req.body;
  const query = `
    UPDATE milestones SET name = ?, description = ?, target = ?, unit = ?, deadline = ?, status = ?
    WHERE id = ?
  `;
  connection.query(
    query,
    [name, description, target, unit, deadline, status, id],
    (err, result) => {
      if (err) throw err;
      connection.query(
        "SELECT * FROM milestones WHERE id = ?",
        [id],
        (err, rows) => {
          if (err) throw err;
          res.json(rows[0]);
        }
      );
    }
  );
})

router.delete('/:id', (req, res) => {
  connection.query(
    `DELETE FROM milestones WHERE id = ?`,
    [req.params.id],
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) res.sendStatus(200);
      else res.sendStatus(500);
    }
  );
})

module.exports = router;