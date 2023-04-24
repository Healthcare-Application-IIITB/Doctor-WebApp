import React, { useState } from "react";
import AuthService from "../services/auth.service";

function Profile() {
    const [img, setImg] = useState("");
    const [doctor,setDoctor] = useState("");

    window.onload = () => {
      AuthService.getDoctor(setDoctor);
      AuthService.getPhoto(setImg);
      }
    console.log(doctor);

    return (
      <div>
         <div className="card text-black mb-5" style={{maxWidth: '75rem', height:'37rem', marginLeft:'17%', zIndex:50}}>
          <div className="card-header" style={{color : 'white', backgroundColor:"#5e17eb", fontWeight:"bold", fontSize:"20px"}}>Profile Details
        </div>
        {doctor==="" ? <div class="loader" style={{marginLeft:"47%", marginTop:"17%"}}></div> : <div className="card-body">
        <img alt="" style={{float:'right', borderRadius:15, boxShadow:'20px', width:'480px', height:'475px'}} src={`data:image/png;base64,${img}`}></img>
          <h5 className="card-title" style={{color:"#5e17eb"}}>Name</h5>
          <p className="card-text">{doctor.fname} {doctor.lname}</p>
          <br></br>
          <h5 className="card-title" style={{color:"#5e17eb"}}>Date Of Birth</h5>
          <p className="card-text">{doctor.dob}</p>
          <br></br>
          <h5 className="card-title" style={{color:"#5e17eb"}}>Sex</h5>
          <p className="card-text">{doctor.sex}</p>
          <br></br>
          <h5 className="card-title" style={{color:"#5e17eb"}}>Specialisation</h5>
          <p className="card-text">{doctor.specialization}</p>
          <br></br>
          <h5 className="card-title" style={{color:"#5e17eb"}}>Qualification</h5>
          <p className="card-text">{doctor.qualification}</p>
          <br></br>
          <h5 className="card-title" style={{color:"#5e17eb"}}>Email ID</h5>
          <p className="card-text">{doctor.email}</p>
        </div>}
        </div>

  </div>
    );
  }

  export default Profile;
