const Passenger = require('../models/Passenger');

const createPassenger = async (data) => {
    const passenger = new Passenger(data);
    await passenger.save();
    return passenger;
};

const getAllPassengers = async () => {
    return await Passenger.find({});
};

const getPassengerById = async (id) => {
    return await Passenger.findById(id);
};

const updatePassenger = async (id, data) => {
    return await Passenger.findByIdAndUpdate(id, data, { new: true });
};

const deletePassenger = async (id) => {
    return await Passenger.findByIdAndDelete(id); // 5 seconds tim;
};

module.exports = {
    createPassenger,
    getAllPassengers,
    getPassengerById,
    updatePassenger,
    deletePassenger
};
