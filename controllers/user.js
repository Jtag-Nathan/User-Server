const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    create: (req, res, next) => {
        userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, (err, result) => {
            if (err) {
                next(err);
            } else {
                res.json({
                    status: "success",
                    message: "User account created!",
                    data: null
                });
            }
        });
    },

    authenticate: (req, res, next) => { //upon providing correct credentials a signed JWT is returned for use on the frontend!
        userModel.findOne({
            email: req.body.email
        },
            (err, userInfo) => {
                if (userInfo === null || err) {
                    next(err);
                } else {
                    if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                        const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'),
                            { expiresIn: '1h' });
                        //res.header('x-auth-header', token).send();
                        //res.send(token);
                        res.json({
                            status: "success",
                            message: `Welcome ${userInfo.name}!`, //Alternitively I can just return a message such as "Logged in successfully!" and get the name from the response for the welcome message
                            token: token,
                            data: {
                                user: userInfo, //After dev/debugging we probably only want to send our token ! Blackglasses said its okay to return the user info too !
                            }
                        });
                    } else {
                        res.json({
                            status: "error",
                            message: "Invalid email/password!",
                            data: null
                        });
                    }
                }
            });
    },

    validateUser: (reqRole) => {
        return (req, res, next) => {
            const token = req.headers['x-access-token'];
            jwt.verify(token, req.app.get('secretKey'), (err, decoded) => {
                if (err) {
                    res.json({ 
                        status: "error", 
                        message: err.message, 
                        data: null 
                    });
                }
                userModel.findById(decoded.id, (err, userInfo) => {
                    if (req.params.id !== decoded.id && userInfo.role !== reqRole) {
                        return res.status(401).json({
                            status: "error",
                            message: "Unathorized request / Wrong role"
                        });
                    }
                    else {
                        req.body.userId = decoded.id;
                        next();
                    }
                });
            });
        }
    },

    validateJWT: (req, res) => {
        jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), (err, decoded) => {
            if (err) {
                //res.json({ status: "error", message: err.message, data: null });
                res.status(401).json({ status: "error", message: "jwt is not valid", data: null });
            } else {
                // add user id to request
                req.body.userId = decoded.id;
                res.json({ status: "success", message: "jwt is valid", data: null});
                //next(); //Dont need next as we are not doing anything after this we just want to return if the JWT is valid or not
            }
            //const myVer = !!decoded; // logs the value as true or false if JWT is valid or not
            //console.log(myVer);
            //return myVer;
        });
    },

    showAll: (req, res, next) => {
        userModel.find((err, userInfo) => {
            if (err) next(err);

            res.json({
                status: "success",
                message: "here are all users",
                data: userInfo
            });
        });
    },

    showById: (req, res, next) => {
        userModel.findById(req.params.id, (err, userInfo) => {
            if (err) next(err);

            res.json({
                status: "success",
                message: "user being retrieved..",
                data: { user: userInfo }
            });
        });
    },

    //Update needs to check if the id actually exist, if it does then update if not then fail and tell us the user doesnt exist
    updateById: (req, res, next) => {
        userModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, userInfo) => {
            if (err) next(err);

            res.json({
                status: "success",
                message: "user updated..",
                data: { user: userInfo }
            });
        });
    },

    deleteById: (req, res, next) => {
        userModel.findByIdAndRemove(req.params.id, (err, userInfo) => {
            if (err) next(err);

            res.json({
                status: "success",
                message: "user removed!",
                data: null
            });
        });
    }
}