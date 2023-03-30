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
          <div className="card-header" style={{color : 'white', backgroundColor:"rgb(38, 201, 225)", fontWeight:"bold", fontSize:"20px"}}>Profile Details
        </div>
        <div className="card-body">
        <img alt="" style={{float:'right', borderRadius:15, boxShadow:'20px', width:'440px', height:'480px'}} src={`data:image/png;base64,${img}`}></img>
          <h5 className="card-title" style={{color:"rgb(38, 201, 225)"}}>Name</h5>
          <p className="card-text">{doctor.fname} {doctor.lname}</p>
          <h5 className="card-title" style={{color:"rgb(38, 201, 225)"}}>Date Of Birth</h5>
          <p className="card-text">{doctor.dob}</p>
          <h5 className="card-title" style={{color:"rgb(38, 201, 225)"}}>Sex</h5>
          <p className="card-text">{doctor.sex}</p>
          <h5 className="card-title" style={{color:"rgb(38, 201, 225)"}}>Specialisation</h5>
          <p className="card-text">{doctor.specialization}</p>
          <h5 className="card-title" style={{color:"rgb(38, 201, 225)"}}>Qualification</h5>
          <p className="card-text">{doctor.qualification}</p>
          <h5 className="card-title" style={{color:"rgb(38, 201, 225)"}}>Email ID</h5>
          <p className="card-text">{doctor.email}</p>
          <h5 className="card-title" style={{color:"rgb(38, 201, 225)"}}>Rating</h5>
          <p className="card-text">{doctor.rating}</p>
        </div>
        </div>

  </div>
    );
  }

  export default Profile;
