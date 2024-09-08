const Ride = require('../models/Ride');
const { assignDriverToRide } = require('../common/assignDrivers/assignRiders')
const Passenger = require('../models/Passenger');
const Driver = require('../models/Driver');
const { sendNotification } = require('../common/assignDrivers/notifications');


const { getIO } = require('../common/websocket/io');


const createRide = async (rideData) => {
    const ride = new Ride(rideData);
    await ride.save();
  
    try {
      await assignDriverToRide(ride._id);
    } catch (error) {
      console.error('Driver assignment failed:', error.message);
    }
  
    return ride;
  };
  


const getAllRidesByPassenger = async (passengerId) => {
    return await Ride.find({ passenger: passengerId }).sort({ createdAt: -1 });
};

const getAllRidesByDriver = async (driverId) => {
    return await Ride.find({ driver: driverId }).sort({ createdAt: -1  });
};



const getRideById = async (id) => {
    return await Ride.findById(id)
      .populate('passenger', 'name email')
      .populate('driver', 'name email');   
};


const updateRide = async (id, data) => {
    return await Ride.findByIdAndUpdate(id, data, { new: true });
};

const deleteRide = async (id) => {
    return await Ride.findByIdAndDelete(id);
};

const updateRideStatus = async (rideId, newStatus) => {
    try {
        const updatedRide = await Ride.findByIdAndUpdate(
            rideId, 
            { 
                status: newStatus, 
                updatedAt: Date.now() 
            }, 
            { new: true } 
        );
        if (!updatedRide) {
            throw new Error('Ride not found');
        }
        return updatedRide;
    } catch (error) {
        console.error('Error updating ride status:', error);
        throw error;
    }
};

const acceptRide = async (driverId, rideId) => {
    const io = getIO();
    const ride = await Ride.findById(rideId);
    if (!ride) throw new Error('Ride not found');

    const driver = await Driver.findById(driverId);
    if (!driver) throw new Error('Driver not found');
    
    if (ride.status !== 'requested') throw new Error('Ride is no longer available');
    
    ride.driver = driverId;
    ride.status = 'accepted';

    driver.availability.currentActivity = 'onRide';
    driver.rideHistory = driver.rideHistory.map(history => {
        if (history.rideId.toString() === rideId) {
            history.status = 'inProgress'; 
        }
        return history;
    });

    try {
        await ride.save();
        await driver.save();

        // Notify passenger
        const passenger = await Passenger.findById(ride.passenger);
        if (passenger) {
            passenger.rideHistory = passenger.rideHistory.map(history => {
              if (history.rideId.toString() === rideId) {
                history.status = 'inProgress';
              }
              return history;
            });
            await passenger.save();
          }
          
          if (passenger && io.to(passenger.socketId)) {
            io.to(passenger.socketId).emit('rideAccepted', {
                message: `Driver ${driver.name} has accepted your ride.`,
                rideId: ride._id,
                driverName: driver.name,
            });
        } else if (passenger && passenger.fcmToken) {
            await sendNotification(passenger.fcmToken, {
                title: 'Driver Accepted',
                body: `Driver ${driver.name} has accepted your ride request.`,
            });
        }

        const otherDrivers = await Driver.find({
            _id: { $ne: driverId },
            'rideHistory.rideId': rideId
        });
        otherDrivers.forEach(async (otherDriver) => {
            otherDriver.rideHistory = otherDriver.rideHistory.map(history => {
                if (history.rideId.toString() === rideId) {
                    history.status = 'canceled'; // They missed the ride
                }
                return history;
            });
            await otherDriver.save();
            if (io.to(otherDriver.socketId)) {
                io.to(otherDriver.socketId).emit('rideMissed', {
                    message: 'The ride has been accepted by another driver.',
                    rideId: ride._id,
                });
            } else if (otherDriver.fcmToken) {
                await sendNotification(otherDriver.fcmToken, {
                    title: 'Ride Unavailable',
                    body: 'The ride has been accepted by another driver.',
                });
            }
        });

        return ride;
    } catch (error) {
        console.error('Error accepting ride:', error);
        throw new Error('Failed to accept ride');
    }
};

const cancelRide = async (rideId, reason) => {
    const ride = await Ride.findById(rideId);
    if (!ride) throw new Error('Ride not found');

    const io = getIO();

    ride.status = 'canceled';
    await ride.save();

    const driver = await Driver.findById(ride.driver);
    if (driver) {
        driver.rideHistory = driver.rideHistory.map(history => {
            if (history.rideId.toString() === rideId) {
                history.status = 'canceled';
            }
            return history;
        });

        driver.availability.currentActivity = 'available';  // Back to available
        await driver.save();

        if (io.to(driver.socketId)) {
            io.to(driver.socketId).emit('rideCancelled', {
                message: `The ride has been canceled. Reason: ${reason}`,
                rideId: ride._id,
            });
        } else if (driver.fcmToken) {
            await sendNotification(driver.fcmToken, {
                title: 'Ride Canceled',
                body: `The ride has been canceled. Reason: ${reason}`,
            });
        }
    }

    // Notify passenger
    const passenger = await Passenger.findById(ride.passenger);
    if (passenger) {
        passenger.rideHistory = passenger.rideHistory.map(history => {
          if (history.rideId.toString() === rideId) {
            history.status = 'canceled';
          }
          return history;
        });
        await passenger.save();

        if (io.to(passenger.socketId)) {
            io.to(passenger.socketId).emit('rideCancelled', {
                message: `Your ride has been canceled. Reason: ${reason}`,
                rideId: ride._id,
            });
        } else if (passenger.fcmToken) {
            await sendNotification(passenger.fcmToken, {
                title: 'Ride Canceled',
                body: `Your ride has been canceled. Reason: ${reason}`,
            });
        }
      }

    return ride;
};




module.exports = {
    createRide,
    getAllRidesByPassenger,
    getAllRidesByDriver,
    getRideById,
    updateRide,
    deleteRide,
    updateRideStatus,
    acceptRide,
    cancelRide,
};
