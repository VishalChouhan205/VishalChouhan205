const express = require('express');
const cors = require('cors')
const app = express();
const { connectDB } = require('./mongoose-config.js');
connectDB(); 
const userRoutes = require('./router/route.js');

app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(express.urlencoded({ limit: '50mb' }));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use('/user', userRoutes);
app.listen(5000, () => {
    console.log('listen');
})
