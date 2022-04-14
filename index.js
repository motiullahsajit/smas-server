const express = require('express');
const app = express();
app.use(require('cors')());
require('dotenv').config();
app.use(express.json());

const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Database is running'))
  .catch((e) => console.log(`MongoDB Connection Error: ${e.message}`));

app.get('/', (req, res, next) => {
  return res.json({ success: true, message: 'server running' });
});


app.use(require('./index.routes'));
const port = process.env.PORT;
app.listen(port, () => console.log(`server is running at port: ${port}`));