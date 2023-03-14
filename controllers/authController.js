const User = require('../models/users');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');

//Register a new user => /api/v1/register
exports.registerUser = catchAsyncErrors( async (req, res, next) => {
    const {name, email, password, role} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendToken(user, 200, res);
});

//Login user => /api/v1/login
exports.loginUser = catchAsyncErrors ( async (req, res, next) => {
    const {email, password} = req.body;

    //Check if email or password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password.', 400));
    }

    //Finding user in database
    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password.', 401));
    }

    //Check if password is correct
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid email or password.', 401));
    }

    sendToken(user, 200, res);
});