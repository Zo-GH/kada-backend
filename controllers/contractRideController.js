const ethers = require('ethers');
const requestMiddleware = require('../middlewares/requestMiddleware');
const errorHandler = require('../middlewares/errorHandler');
const abi = require("../utils/abi.json");
require("dotenv").config();


const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);
const privateKey = process.env.privateKey;
const wallet = new ethers.Wallet(privateKey, provider);
const contractAddress = process.env.contractAddress;

const kadaContract = new ethers.Contract(contractAddress, abi, wallet);

// Controller for booking a ride
const bookRide = async (req, res, next) => {
    requestMiddleware(req, res, next, async () => {
        const { rider, startLocation, endLocation, fare } = req.body;

        try {
            const tx = await kadaContract.bookRide(rider, startLocation, endLocation, ethers.utils.parseEther(fare.toString()));
            const receipt = await tx.wait();
            res.status(201).json({
                message: "Ride booked successfully",
                data: receipt
            });
        } catch (error) {
            errorHandler(error, req, res, next);
        }
    });
};

// Controller for paying for a ride
const payForRide = async (req, res, next) => {
    requestMiddleware(req, res, next, async () => {
        const { rideId } = req.body;

        try {
            const tx = await kadaContract.payForRide(rideId, {
                value: ethers.utils.parseEther(req.body.amount.toString())
            });
            const receipt = await tx.wait();
            res.status(201).json({
                message: "Ride paid successfully",
                data: receipt
            });
        } catch (error) {
            errorHandler(error, req, res, next);
        }
    });
};

// Controller for getting ride details
const getRideDetails = async (req, res, next) => {
    try {
        const rideId = req.params.id;
        const ride = await kadaContract.getRideDetails(rideId);
        res.status(200).json({ data: ride });
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};

// Controller for getting a customer's ride history
const getCustomerRideHistory = async (req, res, next) => {
    try {
        const customer = req.params.customer;
        const history = await kadaContract.getCustomerRideHistory(customer);
        res.status(200).json({ data: history });
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};

// Controller for getting transaction details
const getTransactionDetails = async (req, res, next) => {
    try {
        const transactionId = req.params.id;
        const transaction = await kadaContract.getTransactionDetails(transactionId);
        res.status(200).json({ data: transaction });
    } catch (error) {
        errorHandler(error, req, res, next);
    }
};

module.exports = {
    bookRide,
    payForRide,
    getRideDetails,
    getCustomerRideHistory,
    getTransactionDetails
};
