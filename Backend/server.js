import express from 'express'
import 'dotenv/config.js'
import http from 'http'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middlewares/index.js'


const app = express();


app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended : true, limit: '10mb'}));



// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter); 

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested', { ip: req.ip });
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();
        const server = http.createServer(app);
        server.listen(PORT, () => {
            console.log('Server started successfully', {
                port: PORT,
                environment: process.env.NODE_ENV || 'development',
                healthCheck: `http://localhost:${PORT}/health`,
                apiBase: `http://localhost:${PORT}/api/v1`
            });
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();