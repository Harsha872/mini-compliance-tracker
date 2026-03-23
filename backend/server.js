require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const clientRoutes = require('./routes/clientRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/clients', clientRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
