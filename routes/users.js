const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/', (req, res) => {
    //res.send('Hello World!');
    res.json({"Message" : "This is the users router!"});
});

router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);
router.get('/all', userController.showAll);
router.get('/:id', userController.validateUser("User"), userController.showById); //This route and the two below require users to provide a valid JWT and have the "Admin" role to access any id that is not their own
router.put('/:id', userController.validateUser, userController.updateById);
router.delete('/:id', userController.validateUser, userController.deleteById);

module.exports = router;