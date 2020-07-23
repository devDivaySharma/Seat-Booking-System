const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));


app.get('/freeSeat',(req,res) => {
    Seat.updateMany({reserved: false})
    .then((seat) => console.log(seat), res.status(200).send({message:"All Seat Are Vacant"}))
    .catch((err) => res.status(400).send({message: err}));
})

app.get('/status',(req,res) => {
    Seat.find().then((seat) => res.status(200).send({data:seat}))
    .catch((err) => res.status(400).send({message: err}));
})

app.get('/setup',(req,res) => {
    Seat.find((err,data) => {
        console.log(data.length);
        if(err)
        {
            res.status(400).send({message: err});
        }
        else if(data.length >= 80)
        {
            res.status(200).send({data:data});
        }
        else
        {
            for(let i=0; i < 80;i++)
            {
                let seat = new Seat({reserved: false});
                seat.save();
            }
            res.status(200).send({data:"done"});
        }
    })
})

const mongoose = require('mongoose');
const Seat = require('./seatModel.js').Seat;
const DB_URI = 'mongodb://localhost:27017/booking';

mongoose.connect(DB_URI).then(() => {
  console.log('Listening on port: ' + PORT);
  app.listen(PORT);
});
