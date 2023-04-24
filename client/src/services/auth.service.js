import axios from "axios";

const urlBase = "https://localhost:8080/api";
const user = JSON.parse(localStorage.getItem("doctor"));
console.log(urlBase)
var config = null;

if (user && user.accessToken) {
config = {
  headers: {
    "ngrok-skip-browser-warning": "true",
    Authorization: "Bearer " + user.accessToken,
  }         
};
}

var configPhoto = null;

if (user && user.accessToken) {
  configPhoto = {
    headers: {
      "ngrok-skip-browser-warning": "true",
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + user.accessToken,
    },
  };
}
var configuration = null;

if (user && user.accessToken) {
  configuration = {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: "Bearer " + user.accessToken,
      Accept: "application/json",
    },
  };
}

class AuthService {
  login(username, password) {
    return axios
      .post(urlBase + "/auth/doctor/signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("doctor", JSON.stringify(response.data));
        }
        return response.data;

      });

  }

  logout() {
    localStorage.removeItem("doctor");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("doctor"));
  }

  getDoctor = (setDoctor) => {
    const id = JSON.parse(localStorage.getItem("doctor")).id;
    axios
      .get(`${urlBase}/v1/doctor/getDoctorById/${id}`, config)
      .then((json) => {
        setDoctor(json.data);
        console.log(json.data);
        return json.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getPreviousConsultations = async ()  => {
    const id = JSON.parse(localStorage.getItem("doctor")).id;
    try{
    const json = await axios
      .get(`${urlBase}/v1/consultation/getPrevConsultationsDoctor/${id}`, config)
      
      console.log(json.data)
      return json.data;
    }
    catch(e){
      console.log(e)
    }

  };

  getPhoto = (setImg) => {
    const id = JSON.parse(localStorage.getItem("doctor")).id;
    axios
      .get(`${urlBase}/v1/doctor/getPhotoById/${id}`, configPhoto)
      .then((json) => {
        setImg(json.data);
        console.log(json.data);
        return json.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };


  getPatientsInQueue = (setPatients) => {
    const id = JSON.parse(localStorage.getItem("doctor")).id;
    axios
      .get(`${urlBase}/v1/dqueue/getPatients/${id}`, config)
      .then((json) => {
        setPatients(json.data);
        return json.data;
      })
      .catch((error) => {
        console.log(`MYLOG ERROR : ${error}`);
      });
  };

  getPatientDocuments = async ( setDocuments) => {
    const id = JSON.parse(localStorage.getItem("doctor")).id;
    let cid = await this.getConsultationId(id);
    console.log(cid);
    axios
      .get(`${urlBase}/v1/consultation/getAllDocumentsByCid/${cid}`, config)
      .then((json) => {
        console.log(`My data:s ${json.data}`);
        setDocuments(json.data);
        return json.data;
      })
      .catch((error) => {
        console.log(`My error ${error}`);
        console.log(error);
      });
  };

  downloadPatientDocument = (docId, docName) => {
    console.log("Downloding document");
    axios
      .get(`${urlBase}/v1/document/download/${docId}`, configuration)
      .then((json) => {
        const pdfstr = json.data;
        const linkSource = `data:application/pdf;base64,${pdfstr}`;
        const downloadLink = document.createElement("a");
        const fileName = docName;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getConsultationGraphData = async () => {
    try{
    const id = JSON.parse(localStorage.getItem("doctor")).id;
    const json = await axios
      .get(`${urlBase}/v1/consultation/getPrevConsultationsStats/${id}`, config)
      console.log(json.data)
      return json.data;
    }
    catch(e){
      console.log(e)
    }
  }

  getConsultationId = async(doctorId) => {
    console.log("docid", doctorId)

    let qid = await axios
    .get(`${urlBase}/v1/dqueue/getDqueue/${doctorId}`, config)

    console.log("qid" , qid)

    let cid =  await  axios
    .get(`${urlBase}/v1/dqueue/getConsultationId/${qid.data}`, config);

    return cid.data;
  }

   uploadPrescription =  async (doctorId, prescription) =>{

    console.log("docid", doctorId)

    let qid = await axios
    .get(`${urlBase}/v1/dqueue/getDqueue/${doctorId}`, config)

    console.log("qid" , qid)

    let cid =  await  axios
    .get(`${urlBase}/v1/dqueue/getConsultationId/${qid.data}`, config);

    console.log("cid" , cid)

    let pid = await axios
      .get(`${urlBase}/v1/dqueue/getPatientId/${qid.data}`, config)


      console.log("pid" , pid)


      let formData = new FormData();
      formData.append("file", prescription);
      
      await axios
        .post(
          `${urlBase}/v1/document/uploadPrescription/${pid.data}/${cid.data}`,
          formData,
          configPhoto
        )

  }

  setQueueLimit = async(doctorId, limit) => {
    console.log(config)
    let l = await axios
    .post(`${urlBase}/v1/doctor/setQueueLimit/${doctorId}/${limit}`, {},config);
    console.log(l)
  }
  
  setFollowDate = async(followUpDate) => {
    const id = JSON.parse(localStorage.getItem("doctor")).id;

    let qid = await axios
    .get(`${urlBase}/v1/dqueue/getDqueue/${id}`, config)

    console.log("qid" , qid)

    let cid =  await axios
    .get(`${urlBase}/v1/dqueue/getConsultationId/${qid.data}`, config);

    console.log("cid", cid)

    let followUp = await axios
    .post(`${urlBase}/v1/consultation/setFollowUp/${cid.data}/${followUpDate}`, {}, config);

    console.log(followUp);

  }

  removePatients = async(doctorid) => {
    let remove = await axios
    .get(`${urlBase}/v1/dqueue/removeAllPatient/${doctorid}`, config)
    console.log(remove);
  }

  acceptPatient = async(bool) => {
    const doctorId = JSON.parse(localStorage.getItem("doctor")).id;

    let qid = await axios
    .get(`${urlBase}/v1/dqueue/getDqueue/${doctorId}`, config)

    let toggle = await axios
    .get(`${urlBase}/v1/dqueue/toggleAcceptPatient/${qid.data}/${bool}`,config)

    console.log("togggggggling",toggle);
  }

  removePatientFromQueue = async(patientId) => {
    const doctorId = JSON.parse(localStorage.getItem("doctor")).id;
    console.log("ajsdbajsdbjda",doctorId);
    console.log("ajsdbajsdbjda",patientId);
    let removePatient = await axios
    .get(`${urlBase}/v1/dqueue/removePatient/${doctorId}/${patientId}`,config)

    console.log("ajsdbajsdbjda",removePatient);
  }

}

export default new AuthService();
