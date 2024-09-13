const { getIO } = require('./io')
const BaseUser = require('../../models/BaseUser') ;


module.exports = () => {
  const io = getIO(); // Get the initialized io instance

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("identify", async (data) => {
      const { userId, role } = data;

      let user;

      try {
        if (role === 'rider') {
          user = await BaseUser.findById({ _id: userId, role: 'rider' });
        } else if (role === 'passenger') {
          user = await BaseUser.findById({ _id: userId, role: 'passenger' });
        } else if (role === 'admin') {
          user = await BaseUser.findById({ _id: userId, role: 'admin' });
        }

        if (user) {
          user.socketId = socket.id; // Save the socketId in the user document
          await user.save();
          console.log(`${role} connected:`, userId, 'SocketId:', socket.id);
        } else {
          console.log(`${role} with ID ${userId} not found`);
        }
      } catch (error) {
        console.error(`Error saving socketId for ${role}:`, error);
      }
    });

    socket.on("rideRequest", (data) => {
      io.emit("newRideRequest", data);
      console.log("Ride request sent:", data);
    });

    socket.on("acceptRide", (data) => {
      if (!data.passengerId) {
          console.error("Error: passengerId is missing in data:", data);
          return;
      }
      io.emit(`rideAccepted-${data.passengerId}`, data);
      console.log("Ride accepted by driver:", data);
  });

    socket.on("cancelRide", (data) => {
      io.emit(`rideCanceled-${data.rideId}`, data);
      console.log("Ride canceled:", data);
    });

    socket.on("rideMissed", (data) => {
      console.log("Ride missed:", data);
      io.emit(`rideMissed-${data.rideId}`, data);
    });

    socket.on("noDriversAvailable", (data) => {
      io.emit(`noDriversAvailable-${data.passengerId}`, data);
      console.log("No drivers available event emitted:", data);
    });

    socket.on("driversNotified", (data) => {
      io.emit(`driversNotified-${data.passengerId}`, data);
      console.log("Drivers notified event emitted:", data);
    });

    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);

      // Find the user with this socketId and remove it
      try {
        const user = await BaseUser.findOne({ socketId: socket.id });
        if (user) {
          user.socketId = null; 
          await user.save();
          console.log(`Cleared socketId for user: ${user._id}`);
        }
      } catch (error) {
        console.error('Error removing socketId:', error);
      }
    });
  });
};
