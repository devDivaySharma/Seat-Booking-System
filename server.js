const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;  // setup the port 
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) //parsing the json output for application
app.use(express.static(__dirname + '/public'));// to host static pages


//to get all the seats from system
app.get('/allSeats',(req,res) => {
    Seat.find((err,data) => {
        if(err)
        {
            res.status(400).send({data:err})
        }
        else
        {   
            data = data.sort((a,b) => a.seatNumber-b.seatNumber);
            res.status(200).send({data:data})
        }
    });
})

//to get all the available seats from the system
app.get('/feeAll',(req,res) => {
    Seat.find().updateMany({reserved:false}).then((data) => res.status(200).send({message:"free"}));
})

//book a random seat in system
app.get('/bookrandom',(req,res) => {
    let seatNumber = getRandomNumber();
    Seat.find({seatNumber}).update({reserved:true}).then((data) => res.status(200).send({message:"booked"}));
})

//book the seats
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

//save the seat in the system
function bookSeats(seats,availableSeatsForBook)
{
    let i = 0;
    let selected = availableSeatsForBook.map(s => s.seatNumber);
    while(i < seats)
    {
        updateDatabase({id : i,seatNumber : selected[i]});
        i++;
    }
}

//update the database for selected seats
function updateDatabase(selected)
{
    Seat.findOne({seatNumber:selected.seatNumber}).update({reserved: true}).then((a) => {
        console.log(a);
    });
}

// to get a random number to range between 1-80
function getRandomNumber(){
    min = 1;
    max = 80;
    return Math.ceil(Math.random() * (max - min) + min);
}

// to setup the basic setup for database with 80 seats
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
const DB_URI = 'mongodb://mongo:27018/booking';
//docker based mongo connection 

mongoose.connect(DB_URI).then((v) =>{
    app.listen(PORT, (e)=> {
        if(e) {
            throw new Error('Internal Server Error');
        }else
        {
            console.log(PORT);
        }
        setup();
    });
}).catch(e =>{
    console.log('err',e);
});
