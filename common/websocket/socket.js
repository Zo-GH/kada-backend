const { getIO } = require('./io'); 

module.exports = () => {
  const io = getIO(); // Get the initialized io instance

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("rideRequest", (data) => {
      io.emit("newRideRequest", data);
      console.log("Ride request sent:", data);
    });

    socket.on("acceptRide", (data) => {
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

    socket.on("disconnect", (reason) => {
      console.log("Client disconnected:", socket.id, 'Reason:', reason);
    });
  });
};
