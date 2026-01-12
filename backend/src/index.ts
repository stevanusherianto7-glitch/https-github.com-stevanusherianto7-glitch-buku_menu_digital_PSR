
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// FIX: Mengonfigurasi CORS secara eksplisit untuk mengizinkan semua origin.
// Ini adalah perbaikan standar untuk 'Network Error' selama pengembangan
// saat frontend dan backend berjalan di port yang berbeda (origin yang berbeda).
app.use(cors({
  origin: '*'
}));

app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('RestoHRIS API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});