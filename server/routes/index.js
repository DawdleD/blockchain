const express = require('express');
const router = express.Router();
const Login = require('../controllers/passport/login')
const {getDetail} = require('../controllers/course/information')


/* GET home page. */
router.get('/', async function (req, res, next) {
/*    console.log(dealOrder(1));
    console.log(dealOrder(2));
    console.log(dealOrder(3));
    console.log(dealOrder(4));
    console.log(dealOrder(5));*/


    res.render('index', {title: 'Express'});
});

router.post('/test', getDetail);
module.exports = router;
