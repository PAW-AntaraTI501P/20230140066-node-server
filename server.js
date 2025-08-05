const express = require("express");
const app = express();
const port = 3001;

const todoRoutes = require("./routes/todo.js");
const { todos } = require("./routes/todo.js");

app.use(express.json());
app.use("/todos", todoRoutes); // Use the todo routes

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");//renderi file index.ejs
});

app.get("/contact", (req, res) => {
  res.render("contact"); //render file contact.ejs
});

app.use((req, res, next) => {
  res.status(404).send("404 - page not found"); //render file 404.ejs for not found
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});