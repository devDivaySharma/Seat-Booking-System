const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

app.get('/allSeats',(req,res) => {
    Seat.find((err,data) => {
        if(err)
        {
            res.status(400).send({data:err})
        }
        else
        {
            res.status(200).send({data:data})
        }
    }).sort({seatNumber: 1});
})

app.get('/feeAll',(req,res) => {
    Seat.find().updateMany({reserved:false}).then((data) => res.status(200).send({message:"free"}));
})

app.get('/bookrandom',(req,res) => {
    let seatNumber = getRandomNumber();
    Seat.find({seatNumber}).update({reserved:true}).then((data) => res.status(200).send({message:"booked"}));
})

app.post('/bookseat',(req,res) => {
    let seats = parseInt(req.body.seats);
    let totalAvailableSeats = 0;
    Seat.find({reserved: false}).sort({seatNumber: 1}).then((data) => 
    {
        totalAvailableSeats = data.length;
        if(seats > totalAvailableSeats)
        {
            res.status(200).send({message:"Seats are Not Available"});
        }
        else
        {
           bookSeats(seats,data);
           res.status(200).send({message:"Seats are Booked"});
        }
    });
})


function bookSeats(seats,availableSeatsForBook)
{
    let selected = [];
    let i = 0;
    let b = availableSeatsForBook.map(a => a.seatNumber);
    while(i < seats)
    {
        let a = {id : i,seatNumber : b[i]};
        updateDatabase(a);
        i++;
    }
}

function updateDatabase(selected)
{
    Seat.findOne({seatNumber:selected.seatNumber}).update({reserved: true}).then((a) => {
        console.log(a);
    });
}

function getRandomNumber(){
    min = 1;
    max = 80;
    return Math.ceil(Math.random() * (max - min) + min);
}

function setup() {
    Seat.find((err,data) => {
        if(err)
        {
            console.log(err);
        }
        else if(data.length == 0)
        {
            for(let i=1; i <= 80;i++)
            {
                let seat = new Seat({seatNumber:i,reserved: false});
                seat.save();
            }
        }
    })
}

const mongoose = require('mongoose');
const Seat = require('./seatModel.js').Seat;
const DB_URI = 'mongodb://localhost:27017/booking';

mongoose.connect(DB_URI).then(() => {
    setup();
  console.log('Listening on port: ' + PORT);
  app.listen(PORT);
});
