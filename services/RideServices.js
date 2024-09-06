const Ride = require('../models/Ride');
const { assignDriverToRide } = require('../common/assignRiders')
const Passenger = require('../models/Passenger');
const Driver = require('../models/Driver');
const { sendNotification } = require('../common/notifications');



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
    const ride = await Ride.findById(rideId);
    if (!ride) throw new Error('Ride not found');

    const driver = await Driver.findById(driverId);
    if (!driver) throw new Error('Driver not found');
    
    // Check if ride is still available (not already accepted)
    if (ride.status !== 'requested') throw new Error('Ride is no longer available');
    
    // Assign the driver who accepted first
    ride.driver = driverId;
    ride.status = 'accepted';

    // Update the driver availability and rideHistory
    driver.availability.currentActivity = 'onRide';
    driver.rideHistory = driver.rideHistory.map(history => {
        if (history.rideId.toString() === rideId) {
            history.status = 'inProgress'; // Ride is now in progress for this driver
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
          
        if (passenger && passenger.fcmToken) {
            await sendNotification(passenger.fcmToken, {
                title: 'Driver Accepted',
                body: `Driver ${driver.name} has accepted your ride request.`,
            });
        }

        // Notify other drivers (optional) that they missed the ride
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

    ride.status = 'canceled';
    await ride.save();

    // Update the driver's rideHistory and availability
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
      }
      

    if (passenger && passenger.fcmToken) {
        await sendNotification(passenger.fcmToken, {
            title: 'Ride Canceled',
            body: `Your ride has been canceled. Reason: ${reason}`,
        });
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
