const authRouter = require('./authRoutes');

module.exports = {
    passengerRoutes: require('./passengerRoutes'),
    authRoutes: require('./authRoutes'),
    rideRoutes: require('./rideRoutes'),
    contractRideRoutes: require('./contractRideRoutes.js')
}