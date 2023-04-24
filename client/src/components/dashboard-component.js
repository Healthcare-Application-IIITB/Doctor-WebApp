import React, { Component, useEffect, useLayoutEffect, useState } from "react";
import CanvasJSReact from '../canvasjs/canvasjs.react';
import '../canvasjs/canvasjs.min.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import '../../src/index.css'
import AuthService from "../services/auth.service";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
export default function Dashboard(){
const doctor = JSON.parse(localStorage.getItem("doctor"));
console.log(doctor)
const [consultations,setConsultations] = useState([]);
const [isLoading, setLoading] = useState(true);
const [dataPoints, setDataPoints] = useState([]);
var dataPnts =[];
// var consultations,dataPoints;
const options = { year: "numeric", month: "long", day: "numeric"}
var chart;

const updateData=(dataPoints)=>{
console.log("START")
console.log("data",dataPoints)
for (var i = 0; i < dataPoints.length; i++) {
dataPnts.push({
x: new Date(dataPoints[i].x),
y: dataPoints[i].y
});
}
chart = new CanvasJS.Chart("chartContainer", {
theme: "light2",
title: {
text: "Consultations Trend"
},
data: [{
type: "area",
xValueFormatString: "MMM YYYY",
yValueFormatString: "#",
dataPoints: dataPnts
}]
}); 
console.log("data",dataPoints)
console.log("&&&&&&&&&&&&&&&&&&&&&&&",consultations)
chart.render();
console.log("END")
}

useEffect(async ()=>{
const fetchData= async ()=>{
setConsultations( await AuthService.getPreviousConsultations());
const res = await AuthService.getConsultationGraphData();
setDataPoints(res);
updateData(res)
setLoading(false);
}
await fetchData();
return () => {
console.log("This will be logged on unmount");
}
},[]);

return(
<div>
<div class="container">
<div className="row" style={{display:"-webkit-inline-box"}}>
<div class="column" style={{display:"inline-grid"}}>
<div class="tile job">
<div class="header">
{isLoading ? <div class="count"><div class="loader" style={{marginLeft:"70px"}}></div></div> : <div class="count">{consultations.length}</div>}
</div>
<div class="body">
<div class="title">Consultations</div>
</div>
</div>
<div className="row">
<div class="tile job" style={{marginLeft:"70px"}}>
<div class="header">
{isLoading ? <div class="loader" style={{marginLeft:"60px", marginTop:"30px"}}></div>:<div class="count">{doctor.rating}<FontAwesomeIcon icon={faStar} style={{color: "#f9b41f", marginLeft:"3px"}} /></div>}
</div>
<div class="body">
<div class="title">Rating</div>
</div>
</div>
</div>
</div>
<div className="column" style={{display:"contents"}}>
<div class="card" style={{marginLeft:"20px", height:"370px", width:"850px", marginTop:"30px"}}>
<div class="card-header" style={{fontWeight:"bold", color:"#5e17eb"}}>
Previous Consultations
</div>
<div class="card-body" style={{overflowY:"scroll"}}>
<div class="container">
<div class="row">
<div>
<ul class="list-group">
{isLoading ? <div class="loader" style={{marginLeft:"45%", marginTop:"10%"}}></div> : consultations?.map((consultation) => (
<a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
<div class="flex-column">
{consultation.patientName}
<p><small>{new Date(consultation.startTime).toLocaleDateString(undefined, options)}</small>&nbsp;{consultation.followUpDate ? <small style={{paddingLeft:"420px"}}> Follow Up : {new Date(consultation.followUpDate).toLocaleDateString(undefined, options)}</small> : null}</p> 
{consultation.documentDetailsList.map((documents) => (
<span class="badge badge-info badge-pill" style={{marginLeft:"3px", backgroundColor:"#5e17eb"}} onClick={() => AuthService.downloadPatientDocument(documents.id, documents.name)}>{documents.name}</span>
))}
{consultation.prescription && <span class="badge badge-info badge-pill" style={{marginLeft:"3px", backgroundColor:"green"}} onClick={() => AuthService.downloadPatientDocument(consultation.prescription, "Prescription.pdf")} >Prescription</span>}
</div>
</a>
))}
</ul>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div className="row" style={{marginTop:"10px"}}>
<div>
<div id="chartContainer" style={{height:"60%", width:"100%"}}><div class="loader" style={{marginLeft:"45%", marginTop:"10%"}}></div></div>
</div> 
</div>
</div>
</div> 
)
}
