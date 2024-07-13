const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "new_password",
  database: "ahp_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/programs", (req, res) => {
  connection.query("SELECT * FROM program_studi", (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

app.get("/programs/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM program_studi WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.json(results[0]);
    }
  );
});

app.post("/programs", (req, res) => {
  const {
    nama,
    demand,
    cost,
    resources,
    academic_relevance,
    student_interest,
  } = req.body;
  const query =
    "INSERT INTO program_studi (nama, demand, cost, resources, academic_relevance, student_interest) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    query,
    [nama, demand, cost, resources, academic_relevance, student_interest],
    (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.json({ id: results.insertId });
    }
  );
});

app.put("/programs/:id", (req, res) => {
  const { id } = req.params;
  const { demand, cost, resources, academic_relevance, student_interest } =
    req.body;
  const query =
    "UPDATE program_studi SET demand = ?, cost = ?, resources = ?, academic_relevance = ?, student_interest = ? WHERE id = ?";
  connection.query(
    query,
    [demand, cost, resources, academic_relevance, student_interest, id],
    (err, results) => {
      if (err) {
        console.error("Error updating data:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log(`Updated ${results.affectedRows} row(s)`);
      res.sendStatus(200);
    }
  );
});

app.delete("/programs/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Deleting program with ID: ${id}`); // Tambahkan logging ini
  const query = "DELETE FROM program_studi WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting data:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    console.log(`Deleted ${results.affectedRows} row(s)`);
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
