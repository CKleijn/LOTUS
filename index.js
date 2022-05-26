const express = require("express");
const homeRoutes = require(__dirname + "/src/routes/home.routes");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(homeRoutes);

app.listen(port, () => {
    console.log("Server running at " + port);
});
