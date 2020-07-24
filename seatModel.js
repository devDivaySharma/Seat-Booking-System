const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  seatNumber:{type:Number},
  reserved: {type: Boolean}
});

const Seat = mongoose.model('Seat', SeatSchema)

module.exports = { Seat };
