const User = require("./../models/user.model");
const bcrypt = require("bcrypt");

exports.isLoggedIn = (req, res, next) => {
    const session = req.session;

    console.log(session);
    if (session.userid && session.roles && session.firstname) {
        next();
    } else {
        res.redirect("/login");
    }
};

//Functionality for login
exports.login = (req, res) => {
    const { emailAddress, password } = req.body;

    User.find(function (err, users) {
        if (err) throw err;

        users.forEach((user) => {
            if (emailAddress == user.emailAddress && bcrypt.compareSync(password, user.password)) {
                var session = req.session;
                session.userid = user._id;
                session.roles = user.roles[0];
                session.firstname = user.firstName;

                console.log(user);

                return res.redirect("/");
            }
        });
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/login");
};

exports.getRegisterPage = (req, res) => {
    res.render("register", { pageName: "Registreren" });
};

exports.getLoginPage = (req, res) => {
    res.render("login", { pageName: "Inloggen" });
};
