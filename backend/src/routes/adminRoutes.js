const express = require('express');
const router = express.Router();
const {
  getPendingJobs, moderateJob, getAllUsers, deleteUser, getAnalytics,
} = require('../controllers/adminController');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken, authorize('admin')); // all admin routes require admin role

router.get('/jobs/pending', getPendingJobs);
router.patch('/jobs/:id/moderate', moderateJob);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

module.exports = router;
