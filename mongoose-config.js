const mongoose = require('mongoose');
const localMongoURI = `mongodb://127.0.0.1:27017/fileanalysissystem?retryWrites=true&w=majority&authSource=admin`;

exports.connectDB = async () => {
  await mongoose
    .connect(localMongoURI, {
        useNewUrlParser: true, useUnifiedTopology: true
    })
    .then(() => {
      console.log('MongoDB Connected!');
    })
    .catch((err) => {
      console.error(err);
    });
};
