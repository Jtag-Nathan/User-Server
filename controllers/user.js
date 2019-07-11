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
            if (err)
                next(err);
            else
                res.json({
                    status: "success",
                    message: "User added successfully!",
                    data: null
                });
        });
    },

    authenticate: (req, res, next) => { //basically a log in if the user exists then we return the user a jwt for a 1hr session
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
                            message: "user found!",
                            data: {
                                user: userInfo,
                                token: token
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

    validateUser: (req, res, next) => {
        jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), (err, decoded) => {
          if (err) {
            res.json({status:"error", message: err.message, data:null});
          }else{
            // add user id to request
            req.body.userId = decoded.id;
            next();
          }
        });     
    },

    showAll: (req, res, next) => {
        userModel.find((err, userInfo) => {
            if(err) next(err);

            res.json({
                status: "success",
                message: "here are all users",
                data: userInfo
            });
        });
    },

    showById: (req, res, next) => {
        userModel.findById(req.params.id, (err, userInfo) => {
            if(err) next(err);

            res.json({
                status: "success",
                message: "user being retrieved..",
                data: {user: userInfo}
            });
        });
    },
    //Update needs some middleware implementing to check if the id actually exist, if it does then update if not then fail and tell us the user doesnt exist
    updateById: (req, res, next) => {        
        userModel.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, userInfo) => {
            if(err) next(err);

            res.json({
                status: "success",
                message: "user updated..",
                data: {user: userInfo}
            });
        });
    },

    deleteById: (req, res, next) => {
        userModel.findByIdAndRemove(req.params.id, (err, userInfo) => {
            if(err) next(err);

            res.json({
                status: "success",
                message: "user removed!",
                data: null
            });
        });
    }
}