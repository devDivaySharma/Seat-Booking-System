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
        td.style.width = "50px"
        td.style.height = "50px" 
        td.title = j[0][i].seatNumber
        tr.appendChild(td);
        tbl.appendChild(tr);
    }
    document.getElementById("bookSeat").addEventListener('click',(e) => {
        var seats = prompt("Enter Seats You want to reserve ?");
        $.post('/bookseat',{seats: seats});
    });
    document.getElementById("bookSeatRandom").addEventListener('click',(e) => {
        $.get('/bookrandom');
    })
    document.getElementById("freeSeat").addEventListener('click',(e) => {
        $.get('/feeAll');
    })
  });