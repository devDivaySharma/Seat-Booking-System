$(document).ready(function(){
        const j = []; 
        getTableData().then((value) => {
            j = value;
        });
        let tr;
        for (let i = 0; i < j.length; i++) {
            if (i % 3 === 0)
                tr = document.createElement("tr");
            
            const td = document.createElement("td");
            td.textContent = j[i].id;
            td.style.backgroundColor = j[i].isbooked ? "Red" : "Green";
            td.style.width = "50px"
            td.style.height = "50px" 
            td.title = j[i].name
            td.addEventListener("click", async e => {
                try {
                    const id = e.target.textContent;
                    const name = prompt("Enter your name")
                    const res = await fetch(`/${id}/${name}`, {"method" : "PUT"})
                    const j = await res.json();
                    if (j.error) 
                        alert("FAILED! Couldn't book! already booked.")
                    else
                        alert ("Booked successfully!")
                    
                    e.target.style.backgroundColor = "red";
                }
                catch(ex ){
                    alert("error booking "  + ex)
                }
    

            } )
            tr.appendChild(td);
            tbl.appendChild(tr);
        }
    $("#freeSeat").click(function(){
      $.get('/freeSeat',function(data,status){
          debugger;
      })
    });

    function getTableData()
    {
        new Promise(async (resolve,reject) => {
            $.get('/setup',function(data,status){
                if(data.length > 0)
                {
                    resolve(data);
                }
                else
                {
                    reject(data);
                }
            });
        })
    }
  });