const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const cors = require("cors");
const port = 3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./dua_main.sqlite", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the SQLite database");
  }
});

app.get("/category", (req, res) => {
  const query = "SELECT * FROM category";

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/subCategory/:id", async (req, res) => {
  const catID = req.params.id;
  const query = `SELECT * FROM sub_category WHERE cat_id = ${catID}`;
  const duaQuery = `SELECT * FROM dua WHERE cat_id = ${catID}`;

  try {
    const [subCategoryRows, duaRows] = await Promise.all([
      executeQuery(query),
      executeQuery(duaQuery),
    ]);

    res.json({ subCategory: subCategoryRows, dua: duaRows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

function executeQuery(query) {
    return new Promise((resolve, reject) => {
      db.all(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

app.get("/dua/:id", (req, res) => {
    const catID = req.params.id;
    const query = `SELECT * FROM dua WHERE subcat_id = ${catID}`;
  
    db.all(query, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });








app.get("/", (req, res) => {
  res.send("dua page running successfully");
});

app.listen(port, () => {
  console.log(`dua page is running on port ${port}`);
});
