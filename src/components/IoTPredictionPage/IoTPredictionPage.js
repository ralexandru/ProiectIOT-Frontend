import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./IoTPredictionPage.css";
import navbar from "../NavbarComponent/Navbar.js";
import { Button, Modal } from "react-bootstrap";
import {
  GetTrainingDataEndpoint,
  DeleteAllPastPredictionsEndpoint,
  InsertInputDataEndpoint,
  GetLinearRegressionResultsEndpoint,
  DeleteInputByInputIdEndpoint,
  UpdateInputByInputIdEndpoint,
  PredictMedicalInsuranceChargesEndpoint,
  TrainingDataDocumentIdValue,
} from "../../Constants/Constants.js";

function AdminPage() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [inputData, setInputData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [updateData, setUpdateData] = useState({
    inputId: "",
    age: 0,
    sex: "",
    bmi: 0,
    children: 0,
    smoker: "",
    region: "",
  });

  const [formData, setFormData] = useState({
    inputId: "",
    age: 0,
    sex: "",
    bmi: 0,
    children: 0,
    smoker: "",
    region: "",
  });

  const handleClose = () => {
    setShow(false);
    setFormData({
      inputId: "",
      age: 0,
      sex: "",
      bmi: 0,
      children: 0,
      smoker: "",
      region: "",
    });
  };

  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //Delete All Past Results
  const deletePastResults = async () => {
    try {
      await fetch(DeleteAllPastPredictionsEndpoint, {
        method: "POST",
      });

      fetchResults();
    } catch (error) {
      console.error("Error deleting past predictions:", error);
    }
  };

  //Insert Input Data
  const handleSubmit = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };

    fetch(InsertInputDataEndpoint, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log("Add successful:", data);
        fetchData();
      })
      .catch((error) => {
        console.error("Error adding input:", error);
      });
  };

  //GetInputs
  const fetchData = () => {
    fetch(GetTrainingDataEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          const firstElement = data[0];
          if (
            firstElement &&
            firstElement.inputs &&
            firstElement.inputs.input1
          ) {
            setInputData(firstElement.inputs.input1);
            console.log(data);
          } else {
            console.error(
              "Input1 is missing or undefined in the first element."
            );
            setInputData([]);
          }
        } else {
          console.error("Data is not an array or is undefined:", data);
          setInputData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setInputData([]);
      });
  };

  //Get Inputs Method Call
  useEffect(() => {
    fetchData();
  }, []);

  //Get Results
  const fetchResults = () => {
    fetch(GetLinearRegressionResultsEndpoint)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  //Get Results Method Call
  useEffect(() => {
    fetchResults();
  }, []);

  const handleDeleteConfirmation = (inputId) => {
    setDeleteInput(inputId);
    setShowDeleteConfirmation(true);
  };

  const handleOpenUpdateModal = (angajatData) => {
    setShowUpdateModal(true);
    setUpdateData(angajatData);
  };

  //Delete Input By Input Id
  const handleDelete = () => {
    fetch(
      DeleteInputByInputIdEndpoint.concat(
        TrainingDataDocumentIdValue,
        "/",
        deleteInput
      ),
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          fetchData();
          setShowDeleteConfirmation(false);
        } else {
          // Handle errors here
          console.error(
            "Error deleting input document with inputId:",
            deleteInput
          );
        }
      })
      .catch((error) => console.error("Error making DELETE request:", error));
  };

  //Update Input By InputId
  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(
      UpdateInputByInputIdEndpoint.concat(
        TrainingDataDocumentIdValue,
        "/",
        updateData.inputId
      ),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    )
      .then((response) => {
        if (response.ok) {
          fetchData();
          setShowUpdateModal(false);
        } else {
          console.error(
            "Error updating input with inputId:",
            updateData.inputId
          );
        }
      })
      .catch((error) => console.error("Error making PUT request:", error));
  };

  //Prediction
  const predictScoredLabels = async () => {
    try {
      await fetch(PredictMedicalInsuranceChargesEndpoint);
      fetchResults();
    } catch (error) {
      console.error("Error predicting insurance labels:", error);
    }
  };

  return (
    <div>
      <nav id="navbar">
        <div className="wrapper">
          <div className="logo"></div>
          <span className="welcome-label">
            LinearRegression - IoT Project Frontend Example
          </span>
          <input type="radio" name="slider" id="menu-btn" />
          <input type="radio" name="slider" id="close-btn" />
          <ul className="nav-links">
            <label htmlFor="close-btn" className="btn close-btn">
              <i className="fas fa-times"></i>
            </label>
            <li>
              <a href="">Bajdechi Leonardo</a>
            </li>
            <input type="checkbox" id="showMega" />
            <li>
              <a href="">Raducu Alexandru</a>
            </li>
          </ul>
          <label htmlFor="menu-btn" className="btn menu-btn">
            <i className="fas fa-bars"></i>
          </label>
        </div>
      </nav>

      <div className="container" style={{ marginTop: "160px" }}>
        <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
          <div className="row">
            <div className="col-sm-3 mt-5 mb-4 text-gred">
              <div className="search"></div>
            </div>
            <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred">
              <h2 style={{ color: "black" }}>
                <b>Inputs</b>
              </h2>
            </div>
            <div className="col-sm-3 offset-sm-1 mt-5 mb-4 text-gred">
              <Button variant="primary" onClick={handleShow}>
                Add Inputs
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered custom-table">
                <thead>
                  <tr>
                    <th>InputId</th>
                    <th>Age</th>
                    <th>Sex</th>
                    <th>BMI</th>
                    <th>Children</th>
                    <th>Smoker</th>
                    <th>Region</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inputData.map((input, index) => (
                    <tr key={index}>
                      <td>{input.inputId}</td>
                      <td>{input.age}</td>
                      <td>{input.sex}</td>
                      <td>{input.bmi}</td>
                      <td>{input.children}</td>
                      <td>{input.smoker}</td>
                      <td>{input.region}</td>
                      <td>
                        <a
                          className="edit"
                          title="Edit"
                          data-toggle="tooltip"
                          onClick={() => handleOpenUpdateModal(input)}
                        >
                          <i className="material-icons">&#xE254;</i>
                        </a>
                        <a
                          className="delete"
                          title="Delete"
                          data-toggle="tooltip"
                          onClick={() =>
                            handleDeleteConfirmation(input.inputId)
                          }
                        >
                          <i className="material-icons">&#xE872;</i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p></p>
          <Button variant="primary" onClick={predictScoredLabels}>
            Predict Insurance Scored Labels
          </Button>

          {/* Delete Confirmation Modal */}
          <Modal
            show={showDeleteConfirmation}
            onHide={() => setShowDeleteConfirmation(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Are you sure you want to delete this input? The action is
                irreversible.
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button
                variant="secondary"
                className="btn-modal"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div>
          {/* Update Modal */}
          <Modal
            show={showUpdateModal}
            onHide={() => setShowUpdateModal(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Update input data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label htmlFor="age">Age:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    name="age"
                    value={updateData.age}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, age: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sex">Sex:</label>
                  <select
                    className="form-control"
                    id="sex"
                    name="sex"
                    value={updateData.sex}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, sex: e.target.value })
                    }
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="bmi">BMI:</label>
                  <input
                    type="bmi"
                    className="form-control"
                    id="bmi"
                    name="bmi"
                    value={updateData.bmi}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, bmi: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="children">Children:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="children"
                    name="children"
                    value={updateData.children}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        children: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="smoker">Smoker:</label>
                  <select
                    className="form-control"
                    id="smoker"
                    name="smoker"
                    value={updateData.smoker}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, smoker: e.target.value })
                    }
                    required
                  >
                    <option value="">Yes/No</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="region">Region:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="region"
                    name="region"
                    value={updateData.region}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        region: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                </div>

                <button type="submit" className="btn btn-success mt-4">
                  Update
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div className="model_box">
          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Inputs</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit}>
                <label htmlFor="Age">Age:</label>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="sex">Sex:</label>
                  <select
                    className="form-control"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="BMI">BMI:</label>
                  <input
                    type="number"
                    className="form-control"
                    name="bmi"
                    value={formData.bmi}
                    onChange={handleChange}
                    placeholder="BMI"
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="Children">Children:</label>
                  <input
                    type="number"
                    className="form-control"
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                    placeholder="Children"
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="smoker">Smoker:</label>
                  <select
                    className="form-control"
                    name="smoker"
                    value={formData.smoker}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Yes/No</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="region">Region:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Region"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success mt-4">
                  Add
                </button>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        {/* <!-- Results --> */}
        <h2 style={{ color: "black" }}>
          <b>Linear Regression Results</b>
        </h2>
        <div className="row">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered custom-table">
              <thead>
                <tr>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>BMI</th>
                  <th>Children</th>
                  <th>Smoker</th>
                  <th>Region</th>
                  <th>Predicted Charges</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.age}</td>
                    <td>{item.sex}</td>
                    <td>{item.bmi}</td>
                    <td>{item.children}</td>
                    <td>{item.smoker}</td>
                    <td>{item.region}</td>
                    <td>{item.scoredLabels}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="primary" onClick={deletePastResults}>
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
