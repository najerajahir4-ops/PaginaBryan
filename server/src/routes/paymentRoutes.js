const express = require('express');
const router = express.Router();
const { registerPayment, getStudentPayments } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, registerPayment);
router.get('/student/:studentId', authMiddleware, getStudentPayments);

module.exports = router;
