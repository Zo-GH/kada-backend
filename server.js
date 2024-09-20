const express = require("express");
const cors = require("cors");
const { config } = require('./config/config')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./swaggerConfig')

const {
  passengerRoutes,
  authRoutes,
  rideRoutes,
  driverRoutes,
  contractRideRoutes,
  ratingsRoutes,
  resetPasswordRoutes, 
  commonRoutes,
} = require('./routes')

const connect_database = require("./utils/db");

const app = express();
const server = require("http").createServer(app)
const { init } = require('./common/websocket/io');;
const io = init(server);

const socketHandlers = require('./common/websocket/socket'); 


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use((err, req, res, next) => {
  console.error('Error Handler:', err.message);
  res.status(500).json({ message: err.message });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.use('/passenger', passengerRoutes)
app.use('/rider', driverRoutes)
app.use('/auth', authRoutes)
app.use('/rides', rideRoutes)
app.use('/contract', contractRideRoutes)
app.use('/ratings', ratingsRoutes)
app.use('/email-verification', resetPasswordRoutes)
app.use('/common', commonRoutes)

const PORT = config.PORT || 3000;

connect_database();

socketHandlers(io); 

server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

app.get("/", (req, res, next) => {
  res.send(
    "Welcome to the KADA APP Backend. Go to <a href='/docs/'>/docs</a> for api documentation"
  );
});

module.exports = {
  app,
  io,
}