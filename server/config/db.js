const mongoose = require('mongoose');

module.exports = () => {
  mongoose.set('strictQuery', false);
  return mongoose
    .connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ieducate')
    .then(() => {
      console.log('Mongodb Connected');
    })
    .catch((err) => {
      console.log(err);
      throw new Error('Error occcured while connecting to database');
    });
};
