import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/auth/doctor/";
const urlBase = "http://localhost:8080/api";


const config = {
  // headers: {
  //   "ngrok-skip-browser-warning": "true",
    
  // },
  headers: authHeader()
};
const configPhoto=null;
try{
  configPhoto = {
    headers:{
      "Content-Type":"multipart/form-data",
      "Authorization":"Bearer "+JSON.parse(localStorage.getItem('doctor')).accessToken
    }
  }
}catch(err){
  console.log(err)
}

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
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
    return JSON.parse(localStorage.getItem('doctor'));
  }

  getDoctor = (setDoctor) => {
    const id=JSON.parse(localStorage.getItem('doctor')).id;
    axios
      .get(`${urlBase}/v1/doctor/getDoctorById/${id}`, config)
      .then((json) => {
        setDoctor(json.data);
        console.log(json.data)
        return json.data;
      })
      .catch((error) => {
        console.log(error);
      });
    };

    getPhoto = (setImg) => {
      const id=JSON.parse(localStorage.getItem('doctor')).id;
      axios
        .get(`${urlBase}/v1/doctor/getPhotoById/${id}`, configPhoto)
        .then((json) => {
          setImg(json.data);
          console.log(json.data)
          return json.data;
        })
        .catch((error) => {
          console.log(error);
        });
      };
}

export default new AuthService();