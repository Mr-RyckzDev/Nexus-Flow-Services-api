const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const Config = require('./Config');
const routes = require('./Routes');
const requestId = require('./Middlewares/requestId');
const loggerMiddleware = require('./Middlewares/loggerMiddleware');
const notFound = require('./Middlewares/notFound');
const errorHandler = require('./Middlewares/errorHandler');
const rateLimiter = require('./Middlewares/rateLimiter');
const timeout = require('./Middlewares/timeout');
const apiKeyAuth = require('./Middlewares/apiKeyAuth');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: Config.security.corsOrigin }));
app.use(express.json({ limit: Config.security.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: Config.security.bodyLimit }));

app.use(requestId);
app.use(loggerMiddleware);
app.use(rateLimiter);
app.use(timeout);
app.use(apiKeyAuth);

app.use(Config.server.apiPrefix, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;