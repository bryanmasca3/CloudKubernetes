const { Router } = require('express');
const router = Router();
const{postMain, getMain}=require('../controllers/python.controller');

router.route('/')
    .post(postMain)
    .get(getMain)
module.exports = router;
