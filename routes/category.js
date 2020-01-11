const express = require("express");
const router = express.Router();
const connection = require("../connection");

router.post("/", (req, res) => {
  connection.query(
    `INSERT INTO categories (name, user_id) VALUES(?,?)`,
    [req.body.name, req.session.userId],
    (err, result) => {
      if (err) throw err;
      connection.query(
        "SELECT * FROM categories WHERE id = ?",
        [result.insertId],
        (err, rows) => {
          if (err) throw err;
          res.json(rows[0]);
        }
      );
    }
  );
});

router.delete("/:id", (req, res) => {
  connection.query(
    `DELETE FROM categories WHERE id = ?`,
    [req.params.id],
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows > 0) res.sendStatus(200);
      else res.sendStatus(500);
    }
  );
});

module.exports = router;
