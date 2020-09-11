const express = require('express');
const router = new express.Router();

const auth = require('../middlewares/auth');
const userController = require('../controllers/users');
const coronaController = require('../controllers/corona');

router.get('/', function (req, res) {
    res.json({ message: `Welcome to Corona View Application` });
});

//user routes
router.post('/user/signup', userController.signup);
router.post('/user/login', userController.login);
router.delete('/user/logout', userController.logout);


//Show current active cases, total cases and deaths by corona virus in the world
router.get('/corona/overview', auth, coronaController.overview);

//Show a table of active cases, total cases, recovered and deaths according to the countries
router.get('/corona/summary', auth, coronaController.summary);

module.exports = router;