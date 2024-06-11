import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import authRouter from 'routes/auth';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/auth', authRouter);

app.use(function (err, req, res, next) {
  res.status(500).json({ message: err.message });
} as express.ErrorRequestHandler);

app.listen(3003, () => {
  console.log('Server is running on port 3003');
});
