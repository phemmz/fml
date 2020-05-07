import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';

import routes from './routes';

require('dotenv').config();

const app = express();
const ALLOWED_ORIGINS = ['http://localhost:5000', 'http://localhost:3000'];

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  }
}));
app.use('/api/v1', routes);

app.get('/', (_, res) => {
  res.send({
    message: 'Welcome to Food Market API.'
  });
});

app.use((_, res) => {
  res.status(404).send({
    success: false,
    message: 'Requested route does not exist.'
  });
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
