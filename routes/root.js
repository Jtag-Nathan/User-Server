const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //res.send('Hello World!');
    res.json({"Message" : "This is the root router!"});
});

router.get('/favicon.ico', (req, res) => {
    res.sendStatus(204);
});

module.exports = router;