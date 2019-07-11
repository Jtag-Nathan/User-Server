const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', (req, res) => {
    //res.send('Hello World!');
    res.json({"Message" : "This is the users router!"});
});

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
//router.get('/all', userController.validateUser, userController.showAll); //Requires user to be logged in aka provide JWT to access this route
router.get('/all', userController.showAll);
router.get('/:id', userController.showById);
router.put('/:id', userController.updateById);
router.delete('/:id', userController.deleteById);

module.exports = router;