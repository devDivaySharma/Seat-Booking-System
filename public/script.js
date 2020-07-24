$(document).ready(async function(){
    let j = new Array();
    let data = await $.get('/allSeats');
    j = Object.values(data);
    for (let i = 0; i < j[0].length; i++) {
        if (i % 7 === 0)
            tr = document.createElement("tr");
        
        const td = document.createElement("td");
        td.textContent = j[0][i].id;
        td.style.backgroundColor = j[0][i].reserved ? "Red" : "Green";
        td.style.width = "150px"
        td.style.height = "50px"
        td.style.border = "1px solid black";
        td.title = j[0][i].seatNumber
        tr.appendChild(td);
        tbl.appendChild(tr);
    }
    document.getElementById("bookSeat").addEventListener('click',(e) => {
        var seats = prompt("Enter Seats You want to reserve ?");
        $.post('/bookseat',{seats: seats},(data,status) => {
            if(data)
            {
                window.location.reload();
            }
        });
    });
    document.getElementById("bookSeatRandom").addEventListener('click',(e) => {
        $.get('/bookrandom',(data,status) => {
            if(data)
            {
                window.location.reload();
            }
        });
    })
    document.getElementById("freeSeat").addEventListener('click',(e) => {
        $.get('/feeAll',(data,status) => {
            if(data)
            {
                window.location.reload();
            }
        });
    })
  });