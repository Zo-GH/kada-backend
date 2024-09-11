let io;

module.exports = {
  init: (server) => {
    io = require('socket.io')(server, {
      pingInterval: 600000, 
      pingTimeout: 60000,   
      transports: ['websocket'],
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  }
};
