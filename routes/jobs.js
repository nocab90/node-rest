const express = require('express');
const router = express.Router();

//Importing jobs controller methods
const {
    getJobs,
    getJob,
    newJob,
    getJobsInRadius,
    updateJob,
    deleteJob
} = require('../controllers/jobsController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.route('/jobs').get(getJobs);
router.route('/jobs/:zipcode/:distance').get(getJobsInRadius);
router.route('/job/:id/:slug').get(getJob);

router.route('/job/new').post(isAuthenticatedUser, authorizeRoles('employer', 'admin'), newJob);
router.route('/job/:id')
        .put(isAuthenticatedUser, authorizeRoles('employer', 'admin'), updateJob)
        .delete(isAuthenticatedUser, authorizeRoles('employer', 'admin'), deleteJob);

module.exports = router;