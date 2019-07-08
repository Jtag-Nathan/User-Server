const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    //res.send('Hello World!');
    res.json({"Message" : "This is the root router!"});
});

module.exports = router;