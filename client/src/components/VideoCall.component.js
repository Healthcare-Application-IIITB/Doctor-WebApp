import "../App.css";
import axios from "axios";
import AgoraUIKit, { EndCall } from "agora-react-uikit";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AuthService from "../services/auth.service";
import PatientDocuments from "../components/patientDocuments";
import DoctorQueue from "./queue.component";
import authService from "../services/auth.service";
import Notification from "./notification-component";

window.Buffer = window.Buffer || require("buffer").Buffer;
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const urlBase = "https://localhost:8080/api/v1";

function VideoCall() {
  const [videoCall, setVideoCall] = useState(false);
  const [tokenA, setTokenA] = useState(0);
  const [doctor, setDoctor] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [consultationId, setConsultationId] = useState(-1);
  const [isQueueLimit, setQueueLimit] = useState(false);
  const [isQSet, setQ] = useState(false);
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [ notification, setNotification ] = useState(null)
  const [ notificationType, setNotificationType ] = useState(null)
  const [notify, setNotify] = useState(false);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("doctor"));
  console.log(user.id);

  const config = {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: "Bearer " + user.accessToken,
    },
  };
  const appId = "5e2ee6c6fc13459caa99cb8c234d42e0";
  const appCertificate = "6529c2900f7442b89b7b46666fdca9de";
  var channelId = "";
  const userAccount = "";
  const uid = "0";
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const rtcProps = {
    appId: "5e2ee6c6fc13459caa99cb8c234d42e0",
    channel: "",
    token: "",
  };

  useEffect(() => {
    rtcProps["token"] = tokenA;
    rtcProps["channel"] = channelName;
  });

  const getDoctor = (setDoctor) => {
    axios
      .get(`${urlBase}/doctor/getDoctorById/${user.id}`, config)
      .then((json) => {
        setDoctor(json.data);
        console.log(json.data);
        return json.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const notificationHandler = (message, type) => {
    console.log("noassdhbsadsd")
    setNotification(message)
    setNotificationType(type)
    setNotify(true)

    setTimeout(() => {
      setNotificationType(null)
      setNotification(null)
      setNotify(false)  

    }, 2500)
  }

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

  const handleConfirm = (result) => {
    if (result) {
      console.log("some action...");
    }
    setOpen(false);
  };

  const updateQLimit = async (event) => {
    console.log(isQueueLimit);
    setQ(true);
    authService.setQueueLimit(doctor.id, isQueueLimit).then(()=>{
      notificationHandler(`Queue Limit is set to value ${isQueueLimit}!`, 'success')
    },(error) => {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

        setMessage(resMessage);
      this.notificationHandler(`Error while setting Queue Limit`, 'error');
    });
  };

  const acceptPatient = async () => {
    setOpen(true);
  };

  const acceptedPatient = async () => {
    setOpen(false);
    authService.acceptPatient(true);
  };

  const rejectedPatient = async () => {
    setOpen(false);
    authService.acceptPatient(false);
    callbacks.EndCall();
  };

  const leftPatient = () => {
    authService.acceptPatient(false);
    setOpen(true);
  };

  window.onload = () => {
    getDoctor(setDoctor);
  };

  const handle = (event) => {
    var strng = doctor.userName + doctor.id;
    setChannelName(strng);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert("let patient In");
    // authService.acceptPatient()
    channelId = channelName.toString();
    const tok = await RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelId,
      uid,
      role,
      privilegeExpiredTs
    );
    setTokenA(tok);
    doctor.token = tok;
    doctor.channel_name = channelId;
    doctor.online_status = true;
    console.log(
      "###############################################################################################-",
      tok
    );
    setDoctor(doctor);
    updateDoctor(setDoctor);
    setVideoCall(true);
    acceptPatient();
  };

  window.addEventListener("beforeunload", (ev) => {
    ev.preventDefault();
    doctor.online_status = false;
    updateDoctor(setDoctor);
    authService.removePatients(doctor.id);
    callbacks.EndCall();
    return null;
  });

  const callbacks = {
    EndCall: () => {
      doctor.channel_name = null;
      doctor.token = null;
      doctor.online_status = false;
      setDoctor(doctor);
      updateDoctor(setDoctor);
      authService.removePatients(doctor.id); 
      setVideoCall(false);
    },
    "user-joined": () => console.log("User Joined"),
    "user-left": () => {
      leftPatient();
    },
  };

  async function getConsultationId() {
    let cid = await AuthService.getConsultationId();
    setConsultationId(cid);
    console.log("+++++", cid);
  }

  return videoCall ? (
    <div>
      <Container fluid style={{ marginTop: "15px" }}>
        <Row>
          <Col>
            <DoctorQueue />
          </Col>
          <Col style={{ marginLeft: "1px" }}>
            <div
              style={{
                display: "flex",
                width: "47vw",
                height: "89vh",
                border: "5px solid dodgerblue",
                borderRadius: "10px",
                marginLeft: "10px",
              }}
            >
              <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
            </div>
          </Col>
          <Col style={{ marginLeft: "0px" }}>
            <PatientDocuments doctor={doctor}></PatientDocuments>
          </Col>
        </Row>
        <div className={open ? "confirm show" : "confirm"}>
          <div className="confirm-content">
            <h4 style={{ color: "orange",fontSize:"21px" }}>CONFIRM</h4>
            <div>
              <h2
                style={{ marginTop: "25px", fontSize: "21px", fontWeight:"bold", color: "#5e17eb", textAlign:"center" }}
              >
                Accept Next Patient or Quit Consultation ? 
                <br></br>
                <small style={{color:"red"}}>(Quitting will clear the remaining queue)</small>
              </h2>
            </div>
          </div>
          <div className="confirm-btns">
            <button class="btn btn-outline-success btn-lg" style={{marginLeft:"12px",marginTop:"18px", width:"160px", height:"50px"}}  onClick={() => acceptedPatient()}>
              Allow
            </button>
            <button class="btn btn-outline-danger btn-lg" style={{marginLeft:"12px",marginTop:"18px", width:"160px", height:"50px"}} onClick={() => rejectedPatient()}>
              Quit
            </button>
          </div>
        </div>
        <div className="overlay" onClick={() => handleConfirm(false)} />
      </Container>
    </div>
  ) : (
    <div>
      <Notification notify={notify} notification={notification} type={notificationType} />
      <div
        style={{ display: "inline-flex", marginLeft: "43%", marginTop: "15%" }}
      >
        <button
          type="submit"
          class="btn btn-outline-secondary btn-lg"
          onClick={updateQLimit}
        >
          Set Queue Limit
        </button>
        <input
          style={{
            borderRadius: "5px",
            marginLeft: "10px",
            paddingLeft: "12px",
            width: "60px",
          }}
          name="Rating"
          id="Rating"
          className="add-form-input"
          required
          type="number"
          min="1"
          max="20"
          value={isQueueLimit}
          placeholder={doctor.limit}
          onChange={(e) => {
            console.log(e.target.value);
            setQueueLimit(e.target.value);
          }}
        ></input>
      </div>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          class="btn btn-outline-primary btn-lg"
          disabled={!isQSet}
          style={{ marginLeft: "43%", marginTop: "1%" }}
          onClick={handle}
        >
          Join Video Consultation
        </button>
      </form>
    </div>
  );
}

export default VideoCall;
