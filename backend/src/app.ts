import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { sequelize } from './config/sequelize';
import config from './config/config';

const app = express();

app.use(express.json());
(async () => {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    app.listen(config.port, () => console.log(`API on :${config.port}`));
  })();

// Routes

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;