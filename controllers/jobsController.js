const Job = require('../models/jobs');

const geoCoder = require('../utils/geocoder');

//Get all Jobs => /api/v1/jobs
exports.getJobs = async (req, res, next) => {

    const jobs = await Job.find();

    res.status(200).json({
        success: true,
        // middlewareUser: req.user,
        // requestMethod: req.requestMethod,
        // message: 'This route will display all jobs in future.'
        results: jobs.length,
        data: jobs
    });
}

//Create a new Job => /api/v1/job/new
exports.newJob = async (req, res, next) => {

    const job = await Job.create(req.body);

    res.status(200).json({
        success: true,
        message: 'Job Created.',
        data: job
    })
}

//Get a single job with id and slug => /api/v1/job/:id/:slug
exports.getJob = async (req, res, next) => {
    const job = await Job.find({$and: [{_id:req.params.id}, {slug: req.params.slug}]});

    if (!job || job.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Job not found.'
        });
    }

    res.status(200).json({
        success: true,
        data: job
    })
}

//Update a Job => /api/v1/job/:id
exports.updateJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if(!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found.'
        });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: 'Job is updated.',
        data: job
    });
}

exports.deleteJob = async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found.'
        })
    }

    job = await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Job is deleted.',
        data: job
    });
}

//Search jobs within radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = async (req, res, next) => {
    const { zipcode, distance } = req.params;

    //Getting latitude & longitude from geocoder with zipcode
    const loc = await geoCoder.geocode(zipcode);

    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;

    const radius = distance / 3963;

    const jobs = await Job.find({
        location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
    });

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    });
};