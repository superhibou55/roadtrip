let map = L.map('map')
.setView([53,-8],6);


L.tileLayer(
'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
{
maxZoom:19
}
).addTo(map);



let voyage;
let layers=[];



fetch("voyage.json")
.then(r=>r.json())
.then(data=>{

voyage=data;

document.getElementById("titre")
.innerHTML=data.title;


createButtons();

showAll();

});



function createButtons(){

let div=document.getElementById("buttons");


let b=document.createElement("button");

b.innerHTML="Tout";

b.onclick=showAll;

div.appendChild(b);



voyage.days.forEach(d=>{


let b=document.createElement("button");

b.innerHTML="Jour "+d.day;

b.onclick=()=>showDay(d.day);


div.appendChild(b);


});


}




function clearMap(){

layers.forEach(l=>map.removeLayer(l));

layers=[];

}



function showDay(num){

clearMap();


let day=voyage.days.find(
d=>d.day==num
);


drawDay(day);


}



function showAll(){

clearMap();


voyage.days.forEach(d=>{

drawDay(d);

});


}



function drawDay(day){


let coords=[];


day.points.forEach(p=>{


let marker=L.marker(
[p.lat,p.lon],
{
icon:createIcon(p.type)
}
)
.addTo(map)
.bindPopup(
"<b>"+p.name+
"</b><br>"+
(p.info||"") +
(p.documentUrl ?
"<br>📄 <a target='_blank' href='" +
p.documentUrl +
"'>Document</a>"
:"")
);


layers.push(marker);


coords.push(
[p.lat,p.lon]
);



});



if(coords.length>1){

let line=L.polyline(
coords,
{
weight:4
}
)
.addTo(map);


layers.push(line);

map.fitBounds(
line.getBounds()
);

}


}

function createIcon(type){

let emoji="📍";


switch(type){

case "Départ":
emoji="🏠";
break;

case "Hôtel":
emoji="🛏";
break;

case "Camping":
emoji="⛺";
break;

case "Ferry":
emoji="🚢";
break;

case "Restaurant":
emoji="🍴";
break;

case "Randonnée":
emoji="🥾";
break;

case "Point de vue":
emoji="📷";
break;

case "Visite":
emoji="🏰";
break;

case "Parking":
emoji="🅿";
break;

}


return L.divIcon({

html:
"<div style='font-size:28px'>"+emoji+"</div>",

className:""

});

}
