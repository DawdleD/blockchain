const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/login', function (req, res) {
    console.log(req.body);
    res.json({
        msg: "Yeah!!",
        status: 200
    });
});
module.exports = router;
