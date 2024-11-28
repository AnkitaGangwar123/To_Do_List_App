// This is the to-do list updated according to creation date saved in the back-end 
// in  your schema in postgreSQL
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv"

const app = express();
const port = 3000;

env.config();

const db = new pg.Client({
  user: process.env.USER_NAME,
  host: process.env.USER_HOST,
  database: process.env.USER_DATABASE,
  password: process.env.USER_PASSWORD,
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Function to format date to YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return `${year}-${month}-${day}`;
}

const currentDate = new Date();
const formattedDate = formatDate(currentDate);
const dayOfWeek = currentDate.getDay();
const weeksArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let items =[];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items WHERE date = $1 ORDER BY id ASC", [formattedDate]);
    items = result.rows;

    res.render("index.ejs", {
      listTitle: weeksArray[dayOfWeek],
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItemTitle;
  try {
    await db.query("INSERT INTO items (title, date) VALUES ($1, $2)", [item, formattedDate]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2 AND date = $3", [item, id, formattedDate]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1 AND date = $2", [id, formattedDate]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
