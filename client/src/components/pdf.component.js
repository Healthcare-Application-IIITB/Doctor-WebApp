import React, { useState } from "react";
import Pdf from "react-to-pdf";
import authService from "../services/auth.service";

const ref = React.createRef();

let file = null;
const handleUpload = (e) => {
  file = e.target.files[0];
};

const PDF = (props) => {
  const [value, setValue] = useState(false);
  const [show, setShow] = useState(false);

  const handlePrescriptionUpload = (file) => {
    console.log("Handle Prescription");
    const id=JSON.parse(localStorage.getItem("doctor")).id;
    authService.uploadPrescription(id,file);
  };

  console.log(props.formFields);
  console.log(props.doctor);
  return (
    <>
      <section
        ref={ref}
        style={{
          width: "110%",
          marginLeft: "150px",
          height: "80%",
          overflowY: "auto",
          overflowX: "clip",
        }}
      >
        <div class="row">
          <div class="col-md-8 mb-4">
            <div class="card mb-4">
              <div class="card-header py-3">
                <h5
                  class="mb-0"
                  style={{ marginLeft: "250px", fontSize: "30px" }}
                >
                  Prescription
                </h5>
                <div class="row mb-4">
                  <div class="col">
                    <div class="form-outline">
                      <label class="form-label" for="form6Example1">
                      <img src={require('./../img/HadLOGO.jpeg')} alt="Mountain" style={{width:"144px",height:"54px"}}></img>
                      </label>
                    </div>
                  </div>
                  <div class="col" style={{ marginLeft: "250px" }}>
                    <div class="form-outline" style={{ fontWeight: "bold" }}>
                      <label class="form-label" for="form6Example2">
                        Name : {props.doctor.doctor.fname}{" "}
                        {props.doctor.doctor.lname}
                      </label>
                      <br></br>
                      <label class="form-label" for="form6Example2">
                        Address : {props.doctor.doctor.clinic_address}
                      </label>
                      <br></br>
                      <label class="form-label" for="form6Example2">
                        Qualification : {props.doctor.doctor.qualification}
                      </label>
                      <br></br>
                      <label class="form-label" for="form6Example2">
                        Phone No : +91 9999888800
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <h5 class="mb-0" style={{ fontSize: "30px" }}>
                  Patient Details
                </h5>
                <br></br>
                <form>
                  <div class="row mb-4">
                    <div class="col">
                      <div class="form-outline">
                        <label
                          class="form-label"
                          for="form6Example1"
                          style={{ display: "inline-flex" }}
                        >
                          <p style={{ fontWeight: "bold" }}>Name : </p> &nbsp;
                          {props.patientFname} {props.patientLname}
                        </label>
                      </div>
                    </div>
                    <div class="col">
                      <div class="form-outline">
                        <label
                          class="form-label"
                          for="form6Example3"
                          style={{
                            display: "inline-flex",
                            marginLeft: "125px",
                          }}
                        >
                        </label>
                      </div>
                    </div>
                  </div>

                  <hr class="my-4" />
                  <div class="row mb-4">
                    <div class="col">
                      <div class="form-outline">
                        <div>
                          <form>
                            {props.formFields.map((form, index) => {
                              return (
                                <div key={index}>
                                  <label
                                    class="form-label"
                                    for="formCardNumber"
                                    style={{ display: "inline-flex" }}
                                  >
                                    <p style={{ fontWeight: "bold" }}>
                                      Drug Name :{" "}
                                    </p>{" "}
                                    &nbsp;{form.Name}
                                  </label>
                                  <div style={{ display: "inline-flex" }}>
                                    <div
                                      class="form-check"
                                      style={{
                                        display: "inline-flex",
                                        paddingLeft: "150px",
                                      }}
                                    >
                                      {form.Morning === true ? (
                                        <input
                                          class="form-check-input"
                                          type="checkbox"
                                          checked
                                          readOnly
                                        ></input>
                                      ) : (
                                        <input
                                          class="form-check-input"
                                          type="checkbox"
                                          readOnly
                                        />
                                      )}
                                      <p style={{ marginLeft: "5px" }}>
                                        Morning
                                      </p>
                                    </div>
                                    <div
                                      class="form-check"
                                      style={{
                                        marginLeft: "20px",
                                        display: "inline-flex",
                                      }}
                                    >
                                      {form.Evening === true ? (
                                        <input
                                          class="form-check-input"
                                          type="checkbox"
                                          checked
                                          readOnly
                                        ></input>
                                      ) : (
                                        <input
                                          class="form-check-input"
                                          type="checkbox"
                                          readOnly
                                        />
                                      )}
                                      <p
                                        class="form-check-label"
                                        for="checkoutForm1"
                                        style={{ marginLeft: "5px" }}
                                      >
                                        AfterNoon
                                      </p>
                                    </div>
                                    <div
                                      class="form-check"
                                      style={{
                                        marginLeft: "20px",
                                        display: "inline-flex",
                                      }}
                                    >
                                      {form.Night === true ? (
                                        <input
                                          class="form-check-input"
                                          type="checkbox"
                                          checked
                                          readOnly
                                        ></input>
                                      ) : (
                                        <input
                                          class="form-check-input"
                                          type="checkbox"
                                          readOnly
                                        />
                                      )}
                                      <p
                                        class="form-check-label"
                                        for="checkoutForm1"
                                        style={{ marginLeft: "5px" }}
                                      >
                                        Night
                                      </p>
                                    </div>
                                  </div>
                                  <br></br>
                                  <br></br>
                                </div>
                              );
                            })}
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mb-4">
                    <div class="col">
                      <div class="form-outline">
                        <label class="form-label" for="form6Example1">
                          <p style={{ fontWeight: "bold" }}>Symptoms</p> &nbsp;{" "}
                          {props.symptoms}
                        </label>
                      </div>
                    </div>
                    <div class="col">
                      <div class="form-outline">
                        <label class="form-label" for="form6Example1">
                          <p style={{ fontWeight: "bold" }}>Remarks</p> &nbsp;
                          {props.remarks}
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr class="my-4" />
                  <label class="form-label" for="formCardNumber">
                      Follow Up Date
                    </label>
                    <p>{props.followUpDate}</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div style={{display:"inline-flex"}}>
        <Pdf targetRef={ref} filename="prescription.pdf">
          {({ toPdf }) => (
            <button
              style={{
                marginLeft: "150px",
                width: "200px",
                marginBottom: "20px",
                marginTop:"0px",
                height:"100px"
              }}
              class="btn btn-outline-primary btn-lg btn-block"
              type="submit"
              onClick={() => {
                toPdf();
                setShow(true);
              }}
            >
              Generate Prescription
            </button>
          )}
        </Pdf>
        {show ?(
          <div style={{display:"inline-flex"}}>
        <button
          disabled={!value}
          style={{ marginLeft: "300px", width: "200px", height:"100px", marginBottom: "20px" }}
          class="btn btn-outline-success btn-lg btn-block"
          type="submit"
          onClick={() => {
            handlePrescriptionUpload(file);
          }}
        >
          Upload Prescription
        </button>
        <input
          style={{ marginLeft: "10px", marginTop:"36px" }}
          className="add-form-input"
          type="file"
          placeholder="Photo URL"
          onChange={handleUpload}
          onClick = {() => {setValue(true);}}
        /> 
        </div>) : <div></div>
        }
      </div>
    </>
  );
};

export default PDF;
