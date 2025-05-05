import express, { Response, Request } from "express";
import { ENV } from "./configs/env";
import { errorHandler, logger, notFound, queryHandler } from "./middlewares/common";
import { connectDB, disconnectDB } from "./configs/db";
import { rateLimit } from 'express-rate-limit'
import api from './routes/index.route'
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { shouldCompress } from "./utils/common";

/* ------------------------------------- */
//* Required packages  & configs & middewares
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.set('query parser', 'extended');
app.use(express.urlencoded({ extended: true }));
app.use(logger());
app.use(queryHandler);
app.use('/api/v1', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 100,
  message: 'Too many requests, please try again later.'
}));
app.use(compression({
  threshold: 1024,
  level: 6,
  filter: shouldCompress,
}
));

const PORT = ENV.port;
/* ------------------------------------- */
//* Routes

// HomePath:
app.all('/', (req: Request, res: Response) => {

  res.send({
    error: false,
    message: 'Welcome to BlogLy API',
    documents: {
      swagger: '/documents/swagger',
      redoc: '/documents/redoc',
      json: '/documents/json',
    }
  })
});

// API routes:
app.use("/api/v2", api);

// Static files:
app.use('/uploads', express.static('uploads'));


app.use(notFound).use(errorHandler); // Error handling & 404 middlewares
/* ------------------------------------- */
//* Server and DB connection

async function startServer() {
  try {
    await connectDB();     // Connect MongoDB

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    process.on('SIGINT', async () => { // Implement graceful shutdown:
      await disconnectDB();
      process.exit(0);
    });
  } catch (error: any) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Exit on failure
  }
};

startServer();