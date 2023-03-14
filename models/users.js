const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter yor name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    role: {
        type: String,
        enum: {
            values: ['user', 'employer'],
            message: 'Please select the correct role'
        },
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter a password for your account'],
        minLength: [8, 'Password must be at least 8 characters long'],
        select: false   //Not shown
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

//Encrypt password before saving user
userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
});

//Return JSON Web Token
userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id:this._id },  process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME });
};

//Compare input password with database password
userSchema.methods.comparePassword = async function(enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);