
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { dbConnection } from './configs/dbConnection';
import authentication from './middlewares/authentication';
// import logger from './middlewares/logger';
import queryHandler from './middlewares/queryHandler';
import routes from './routes';
import {errorHandler} from './middlewares/errorHandler';


/* ------------------------------------------------------- */
//* Requireds:
const app = express();

// Load environment variables:
config();

// Enable CORS:
app.use(cors());
const HOST = process.env?.HOST || '127.0.0.1'
const PORT = process.env?.PORT || 8000

// Catch async errors:
import 'express-async-errors';

// Database Connection:
dbConnection();
/* ------------------------------------------------------- */
//* Middlewares:

// Parse JSON bodies:
app.use(express.json());

// Static files:
app.use('/uploads', express.static('uploads'));

// Authentication:
app.use(authentication);

// Logger:
// app.use(logger);

// Query Handler:
app.use(queryHandler);
/* ------------------------------------------------------- */
//* Routes:

// HomePath:
app.all('/', (req, res) => {

    res.send({
        error: false,
        message: 'Welcome to BlogLy API',
        documents: {
            swagger: '/documents/swagger',
            redoc: '/documents/redoc',
            json: '/documents/json',
        }
    })
})

// API Routes:
app.use('/api', routes);

// Not Found:
app.use('*', (req, res) => {
    res.status(404).send({
        error: true,
        message: 'Route Not Found',
    })
})

// Error Handler:
app.use(errorHandler);


app.listen(PORT, () => console.log(`Server runing at: http://localhost:${PORT}`))