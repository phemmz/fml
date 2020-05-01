import express from 'express';
import bodyparser from 'body-parser';
require('dotenv').config();

import routes from './routes';

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.get('/', (_, res) => {
  res.send({
    message: 'Welcome to Food Market API.'
  });
});

app.use((_, res) => {
  res.status(404).send({
    message: 'Requested route does not exist.'
  });
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
