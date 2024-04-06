const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/socialNetworkDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Could not connect to MongoDB', err);
});

app.use('/api', routes); 

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
