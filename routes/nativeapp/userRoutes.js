const express = require('express');
const { UserLogin, UserLogout } = require('../../controllers/native_app/user/user');


const router = express.Router();
router.post('/login', UserLogin);

router.post('/logout', UserLogout);

module.exports = router;
