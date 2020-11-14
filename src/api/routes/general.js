const express = require('express');

const router = express.Router();
const generalCtrl = require('../controllers/general.controller');

/* Authentication Routes */

router.get('/test-hook', generalCtrl.testHook);
router.get('/bemob-postback', generalCtrl.bemobPostback);
router.get('/get-current-month-commissions', generalCtrl.getCurrentMonthCommissions);
router.get('/get-recent-commissions', generalCtrl.getRecentCommissions);

module.exports = router;
