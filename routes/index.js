const authRouter = require('./authRoutes');

module.exports = {
    passengerRoutes: require('./passengerRoutes'),
    authRoutes: require('./authRoutes'),
    rideRoutes: require('./rideRoutes'),
    driverRoutes: require('./driverRoutes')
}