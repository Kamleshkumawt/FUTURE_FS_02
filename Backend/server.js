import express from 'express'
import 'dotenv/config.js'
import http from 'http'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import connectDB from './config/db.js'
import routes from './routes/index.js'
import { notFound, errorHandler } from './middlewares/index.js'
import cookieParser from 'cookie-parser';
// import Product from './models/product.model.js';
// import data from './products.json' with { type: 'json' };
// import categories from './categories.json' with { type: 'json' };
// import Category from './models/category.model.js';
import cors from 'cors';


const app = express();


// Middleware
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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

app.use('/api/xyz', routes);

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
        // await Product.insertMany(data);
// console.log('✅ Sample products inserted successfully');
// Clear existing
    // await Category.deleteMany({});
    // console.log("🧹 Existing categories cleared");

    // // Insert new
    // await Category.insertMany(categories);
    // await Product.insertMany(data);
    // console.log("✅ Categories inserted successfully");
        const server = http.createServer(app);
        server.listen(PORT, () => {
            console.log('Server started successfully', {
                port: PORT,
                environment: process.env.NODE_ENV || 'development',
                healthCheck: `http://localhost:${PORT}/health`,
                apiBase: `http://localhost:${PORT}/api/xyz`
            });
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();