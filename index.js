const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const router = require('./router/index');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// session middleware
app.use("/customer", session({ 
    secret: process.env.SESSION_SECRET, 
    resave: true, 
    saveUninitialized: true
}));

// authentication middleware
app.use("/customer/auth/*", (req, res, next)=>{
    if (req.session.authorization) {
        let token = req.session.authorization["accessToken"];
        jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
            if (err) {
                return res.status(403).json({ "message": "User not authenticated" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(403).json({ "message": "User not logged in" });
    }
});

// route handlers
app.use(router);

app.listen(PORT, ()=>{
    console.log("Express server is up and running ...");
});
