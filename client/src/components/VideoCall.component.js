import '../App.css';
import axios from "axios";
import AgoraUIKit from "agora-react-uikit";
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';
import AuthService from "../services/auth.service";
import Prescription from "./prescription.component"
window.Buffer = window.Buffer || require("buffer").Buffer;
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');

const urlBase = "http://localhost:8080/api/v1";

function VideoCall() {
  const [videoCall, setVideoCall] = useState(false);
  const [tokenA, setTokenA] = useState(0);
  const [doctor, setDoctor] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [userId, setUserId] = useState(0);
  
    const user = AuthService.getCurrentUser();
    console.log(user.id);
  
  const config = {
  headers: authHeader()
  };
  const appId = '5e2ee6c6fc13459caa99cb8c234d42e0';
  const appCertificate = '6529c2900f7442b89b7b46666fdca9de';
  var channelId = "";
  var uid= 0;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

const rtcProps = {
    appId : "5e2ee6c6fc13459caa99cb8c234d42e0", 
    channel : "",
    token : "",
    uid:0
};

const getDoctor = (setDoctor) => {
  axios
    .get(`${urlBase}/doctor/getDoctorById/${user.id}`, config)
    .then((json) => {
      setDoctor(json.data);
      console.log(json.data)
      return json.data;
    })
    .catch((error) => {
      console.log(error);
    });
  };

const updateDoctor = (setDoctor) => {
  axios
    .post(`${urlBase}/doctor/updateDoctor`, doctor, config)
    .then(() => {
      getDoctor(setDoctor);
    })
    .catch((error) => {
      alert("Error While Updating");
      console.log(error);
    });
};


window.onload = () => {
    getDoctor(setDoctor);
    }

  useEffect(() => { 
      rtcProps["channel"] = channelName;
      rtcProps["token"] = tokenA;
      rtcProps["uid"] = userId;
    });

const handle = (event) => {
      var strng = doctor.userName + doctor.id;
      setUserId(doctor.id);
      setChannelName(strng);
};

const handleSubmit = (event) => {
    event.preventDefault();
    channelId = channelName;
    uid = userId;
    let tok = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelId, uid, role, privilegeExpiredTs);
    setTokenA(tok);
    doctor.token = tok;
    doctor.channel_name = String(doctor.userName);
    setDoctor(doctor);
    updateDoctor(setDoctor);
    setVideoCall(true);    
};

const callbacks = {
  EndCall: () => {
    doctor.channel_name = null;
    doctor.token = null;
    setDoctor(doctor);
    updateDoctor(setDoctor);
    setVideoCall(false);
  }
};

return videoCall ? (
  <div>
  <div style={{ display: "flex", marginLeft:"400px",marginTop:"20px",width: "60vw", height: "90vh", border: "5px solid dodgerblue", borderRadius: "10px"}}>
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
  </div>
  <br></br>
  <br></br>
  <br></br>
  <br></br>
  <Prescription></Prescription>
  </div>
) : (
    <form onSubmit={handleSubmit}>
    <button type="submit" onClick={handle}>Join</button>
  </form>
);
}

export default VideoCall;
