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
    if (err) throw err;
    res.json(results);
  });
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
    (err) => {
      if (err) throw err;
      res.sendStatus(200);
    }
  );
});

app.delete("/programs/:name", (req, res) => {
  const { name } = req.params;
  const query = "DELETE FROM program_studi WHERE nama = ?";
  connection.query(query, [name], (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
