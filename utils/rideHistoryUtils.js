const updateRideHistory = async (user, rideId, status) => {
    try {
        user.rideHistory.push({
            rideId,
            status,
        });
        await user.save();
    } catch (error) {
        console.error('Error updating ride history:', error);
    }
};

module.exports = {
    updateRideHistory,
};
