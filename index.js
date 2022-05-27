const express = require("express");
const homeRoutes = require(__dirname + "/src/routes/home.routes");
const userRoutes = require(__dirname + "/src/routes/user.routes");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(homeRoutes);

app.use(userRoutes);

app.listen(port, () => {
    console.log("Server running at " + port);
});
