const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter Job title.'],
        trim: true,
        maxlength: [100, 'Job title cannot exceed 100 characters.']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please enter Job description.'],
        maxlength: [1000, 'Job description cannot exceed 1000 characters.']
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please add a valid email address']
    },
    address: {
        type: String,
        required: [true, 'Please add an address.']
    },
    company: {
        type: String,
        required: [true, 'Please add Company name.']
    },
    industry: {
        type: [String],
        required: true,
        enum: {
            values: [
                'Business',
                'Information Technology',
                'Banking',
                'Education/Training',
                'Telecommunication',
                'Others'
            ],
            message: 'Please select correct options for industry.'
        }
    },
    jobType: {
        type: String,
        required: true,
        enum: {
            values: [
                'Permanent',
                'Temporary',
                'Internship'
            ],
            message: 'Please select correct options for job type.'
        }
    }
});

// Creating job slug before saving
jobSchema.pre('save', function(next){
    // Creating slug before saving to DB
    this.slug = slugify(this.title, {lower: true});

    next();
});

module.exports = mongoose.model('Job', jobSchema);