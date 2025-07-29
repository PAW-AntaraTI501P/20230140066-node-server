const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");//renderi file index.ejs
});

app.get("/contact", (req, res) => {
  res.render("contact"); //render file contact.ejs
});

app.use((req, res, next) => {
  res.status(404).render("404 - page not found"); //render file 404.ejs for not found
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});