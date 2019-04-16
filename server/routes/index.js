const express = require('express');
const router = express.Router();
const Login = require('../controllers/passport/login')
const {findAllByPhoneOrEmail, addUser} = require('../service/user/passport')
const {updateByUserID} = require('../service/user/information')


/* GET home page. */
router.get('/', async function (req, res, next) {
    let object = {birthday: Date.now(), sex: 'F'};
    await updateByUserID(12345, object);

    res.render('index', {title: 'Express'});
});

router.post('/login', Login.login);
module.exports = router;
