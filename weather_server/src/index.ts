import Express from 'express';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weather';
import connectDB from './config/db';
import cors from 'cors';
import { verifyToken } from './middlewares/verifyToken';

import fs from 'fs';
import https from 'https';

const privateKey = fs.readFileSync('../private-key.pem');
const certificate = fs.readFileSync('../certificate.pem');
const credentials = { key: privateKey, cert: certificate };

//For env File
dotenv.config();

// Database connection
connectDB();

const app = Express();
const port = process.env.PORT || 8000;

app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));

app.use('/weather', verifyToken, weatherRoutes);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
