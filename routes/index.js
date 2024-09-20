const authRouter = require('./authRoutes');

module.exports = {
    passengerRoutes: require('./passengerRoutes'),
    authRoutes: require('./authRoutes'),
    rideRoutes: require('./rideRoutes'),
    driverRoutes: require('./driverRoutes'),
    contractRideRoutes: require('./contractRideRoutes.js'),
    ratingsRoutes: require('./ratingRoutes.js'),
    resetPasswordRoutes: require('./otpRoute'),
    commonRoutes: require('./commonRoutes.js'),
}