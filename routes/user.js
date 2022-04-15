const router = require('express').Router();
const C = require('../controllers/user');

router.get('/check', C.checkserver);
router.get('/all', C.allUsers);
router.post('/register', C.register);
router.post('/login', C.login);
router.post('/getUser', C.getUser);
router.post('/subscription', C.subscriptionReq);
router.get('/getSubscription', C.getSubscription);
router.post('/subAction', C.subAction);

module.exports = router;