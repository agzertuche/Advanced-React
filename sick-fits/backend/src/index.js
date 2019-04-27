const cookieParser = require('cookie-parser');
require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');
const jwt = require('jsonwebtoken');

const server = createServer();

// Use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// Decode the JWT to get the user Id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // Put the userId onto the req for future requests to access
    req.userId = userId;
  }

  next();
});

// Middleware that populates the user on each request
server.express.use(async (req, res, next) => {
  if (!req.userId) return next();

  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, permissions, email, name }',
  );

  req.user = user;
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  },
);
