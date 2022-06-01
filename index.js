const express = require("express");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const sessions = require("express-session");
const homeRoutes = require(__dirname + "/src/routes/home.routes");
const userRoutes = require(__dirname + "/src/routes/user.routes");
const authRoutes = require(__dirname + "/src/routes/auth.routes");

const app = express();

const port = process.env.PORT || 3000;

app.use(
    sessions({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized: true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        resave: false,
    })
);

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(authRoutes);

app.use(homeRoutes);

app.use(userRoutes);

app.listen(port, () => {
    console.log("Server running at " + port);
});
