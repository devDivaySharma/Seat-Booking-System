const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  reserved: {type: Boolean}
});

const Seat = mongoose.model('Seat', SeatSchema)

module.exports = { Seat };
