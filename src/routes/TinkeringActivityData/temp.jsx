import React from "react";
import { Bars } from "react-loader-spinner";
import db from "../../firebase/firestore";
import {
  addSubject,
  addTopic,
  addSubTopic,
  getSubjects,
  getSubtopics,
  getTopics,
  deleteSubtopic,
  deleteSubject,
  deleteTopic,
} from "../../firebase/firestore";
import Popup from "../../components/Popup";
import Sidebar from "../../components/Sidebar";
//import { doc } from "firebase/firestore";

function AddSubjectForm() {
  const [fieldType, setFieldType] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [subTopic, setSubTopic] = React.useState("");
  const [deletingDocId, setDeletingDocId] = React.useState("");
  const [loadingTrigger, setLoadingTrigger] = React.useState(false);
  const [listOfData, setListOfData] = React.useState([]);
  const [popUpOpen, setPopupOpen] = React.useState(false);

  function getDetails(fieldType) {
    if (fieldType === "Subject") {
      getSubjects()
        .then((docSnaps) => {
          const dataArray = [];
          docSnaps.forEach((docSnap) => {
            const data = docSnap.data();
            data.id = docSnap.id;
            dataArray.push(data);
          });
          setListOfData(dataArray);
        })
        .catch((err) => {
          console.log("Error:", err);
          window.location.reload();
        });
    } else if (fieldType === "SubTopic") {
      getSubtopics()
        .then((docSnaps) => {
          const dataArray = [];
          docSnaps.forEach((docSnap) => {
            const data = docSnap.data();
            data.id = docSnap.id;
            dataArray.push(data);
          });
          setListOfData(dataArray);
        })
        .catch((err) => {
          console.log("Error:", err);
          window.location.reload();
        });
    } else if (fieldType === "Topic") {
      getTopics()
        .then((docSnaps) => {
          const dataArray = [];
          docSnaps.forEach((docSnap) => {
            const data = docSnap.data();
            data.id = docSnap.id;
            dataArray.push(data);
          });
          setListOfData(dataArray);
        })
        .catch((err) => {
          console.log("Error:", err);
          window.location.reload();
        });
    }
  }

  function clearForm() {
    setFieldType("");
    setSubject("");
    setTopic("");
    setSubTopic("");
    setListOfData([]);
  }

  function handleChange(event) {
    if (event) {
      if (event.target.name === "fieldType") {
        setFieldType(event.target.value);
        getDetails(event.target.value);
      } else if (event.target.name === "subName") {
        setSubject(event.target.value);
      } else if (event.target.name === "topicName") {
        setTopic(event.target.value);
      } else if (event.target.name === "subTopicName") {
        setSubTopic(event.target.value);
      } else if (
        event.target.name === "deleteSub" ||
        event.target.name === "deleteTopic" ||
        event.target.name === "deleteSubTopic"
        ) {
        setDeletingDocId(event.target.value);
      }
    }
  }

  function hasDuplicates(array) {
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < array.length; ++i) {
        var value = array[i].toLowerCase(); // Convert to lowercase for case-insensitive comparison
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false; 
}


async function handleSubmit(event) {
    event.preventDefault();

    if (
        fieldType === "" ||
        (fieldType === "Subject" && subject === "") ||
        (fieldType === "Topic" && topic === "") ||
        (fieldType === "SubTopic" && subTopic === "")
    ) {
        alert("Fill the data correctly!");
    } else {
        const dataList = listOfData.map((data) => data.name);

        if (hasDuplicates(dataList)) {
            alert("Data has duplicate values!");
        } else {
            if (fieldType === "Subject") {
                await addSubject(subject)
                    .then(() => {
                        alert("Added successfully!!");
                        clearForm();
                        window.location.href = "/ta-data/add-subject";
                    })
                    .catch((err) => {
                        console.log(err);
                        alert("Adding data failed! Please try again.");
                    });
            } else if (fieldType === "Topic") {
                await addTopic(topic)
                    .then(() => {
                        alert("Added successfully!!");
                        // clearForm();
                        window.location.href = "/ta-data/add-subject";
                    })
                    .catch(() => {
                        alert("Adding data failed! Please try again.");
                    });
            } else if (fieldType === "SubTopic") {
                await addSubTopic(subTopic)
                    .then(() => {
                        alert("Added successfully!!");
                        clearForm();
                        window.location.href = "/ta-data/add-subject";
                    })
                    .catch(() => {
                        alert("Adding data failed! Please try again.");
                    });
            }
        }
    }
}

  function handleReset(event) {
    if (event.target.type === "reset") {
      clearForm();
    }
  }

  function handleClick(event) {
    if (event.target.name === "delete") {
      deleteField(deletingDocId);
    }
  }

  function deleteAnyField() {
    setPopupOpen(true);
  }

  async function deleteField(docId) {
    if (fieldType === "") {
      alert("Fill the data correctly!");
    } else {
      if (fieldType === "Subject") {
        await deleteSubject(docId);
         alert("Deleted success!!!");
         clearForm();
         window.location.href = "/ta-data/add-subject";
      } 
        else if (fieldType === "Topic") {
        await deleteTopic(docId);
        alert("Deleted success!!!")
        clearForm();
         window.location.href = "/ta-data/add-subject";
      } 
        else if (fieldType === "SubTopic") {
        await deleteSubtopic(docId);
        alert("Deleted success!!!")
        clearForm();
         window.location.href = "/ta-data/add-subject";
      }
    }
  }

  document.title = "Tinkering Activity Data Form | Digital ATL";

  return (
    <div className="container" id="mobilescreen">
      <Sidebar />
      <link rel="stylesheet" href="/CSS/school.css" />
      <Popup
        trigger={loadingTrigger}
        setPopupEnabled={setLoadingTrigger}
        closeAllowed={false}
      >
        <div
          style={{
            height: "85%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bars
            height="80"
            width="80"
            radius="9"
            color="black"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
        </div>
      </Popup>
      <form>
        <div className="school-title">
          Add Your Subject / Topic / SubTopic
        </div>
        <hr />
        <div className="formContainer">
          <div className="row">
            <div className="column">
              <div className="row">
                <label htmlFor="fieldType">
                  <strong>Field Type:</strong>{" "}
                </label>
                <select
                  name="fieldType"
                  id="fieldType"
                  className="form-inp"
                  onChange={handleChange}
                >
                  <option value="" selected>
                    SELECT
                  </option>
                  <option value="Subject">Subject</option>
                  <option value="Topic">Topic</option>
                  <option value="SubTopic">SubTopic</option>
                </select>
              </div>
              <div className="row">
                {fieldType === "Subject" ? (
                  <div className="column">
                    <label htmlFor="subName">
                      <strong>Subject Name:</strong>{" "}
                    </label>
                    <input
                      type="text"
                      name="subName"
                      id="subName"
                      placeholder="Enter the Subject Name"
                      className="form-inp"
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  ""
                )}
                {fieldType === "Topic" ? (
                  <div className="column">
                    <label htmlFor="topicName">
                      <strong>Topic Name:</strong>{" "}
                    </label>
                    <input
                      type="text"
                      name="topicName"
                      id="topicName"
                      placeholder="Enter the Topic Name"
                      className="form-inp"
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  ""
                )}
                {fieldType === "SubTopic" ? (
                  <div className="column">
                    <label htmlFor="subTopicName">
                      <strong>SubTopic Name:</strong>{" "}
                    </label>
                    <input
                      type="text"
                      name="subTopicName"
                      id="subTopicName"
                      placeholder="Enter the SubTopic Name"
                      className="form-inp"
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="column">
              <h3 htmlFor="Display">
                {"List of " + (fieldType ? fieldType : "Field") + "s"}
              </h3>
              <table>
                <tbody>
                  {listOfData.map((data, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          fontSize: 20,
                          margin: 5,
                        }}
                      >
                        {data.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="buttonsContainer formContainer">
          <button
            type="submit"
            className="submitbutton"
            onClick={handleSubmit}
          >
            Add
          </button>
          <button
            type="reset"
            className="resetbutton"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            type="button"
            style={{ marginLeft: 15 }}
            name="delete"
            className="resetbutton"
            onClick={deleteAnyField}
          >
            Delete Any Field
          </button>
        </div>
      </form>
      <Popup
        trigger={popUpOpen}
        setPopupEnabled={setPopupOpen}
        closeAllowed={true}
      >
        <h1>Delete Any Field</h1>
        <div className="formContainer">
          <div className="row">
            <div className="column">
              <label htmlFor="fieldType">
                <strong>Field Type:</strong>{" "}
              </label>
              <select
                name="fieldType"
                id="fieldType"
                className="form-inp"
                onChange={handleChange}
              >
                <option value="">SELECT</option>
                <option value="Subject">Subject</option>
                <option value="Topic">Topic</option>
                <option value="SubTopic">SubTopic</option>
              </select>
            </div>
            <div className="column">
              {fieldType === "Subject" ? (
                <div>
                  <label htmlFor="DeleteSub">
                    <strong>Select {fieldType}:</strong>
                  </label>
                  <select
                    name="deleteSub"
                    id="DeleteSub"
                    className="form-inp"
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {listOfData.map((data, index) => (
                        <option
                          data-delete={data.id}
                          key={index}
                          value={data.id}
                        >
                          {data.name}
                        </option>
                      ))}
                  </select>
                </div>
              ) : null}
              {fieldType === "Topic" ? (
                <div>
                  <label htmlFor="DeleteTopic">
                    <strong>Select {fieldType}:</strong>
                  </label>
                  <select
                    name="deleteTopic"
                    id="DeleteTopic"
                    className="form-inp"
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {listOfData.map((data, index) => (
                      <option
                        data-delete={data.id}
                        key={index}
                        value={data.id}
                      >
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              {fieldType === "SubTopic" ? (
                <div>
                  <label htmlFor="DeleteSubtopic">
                    <strong>Select {fieldType}:</strong>
                  </label>
                  <select
                    name="deleteSubTopic"
                    id="DeleteSubtopic"
                    className="form-inp"
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {listOfData.map((data, index) => (
                      <option
                        data-delete={data.id}
                        key={index}
                        value={data.id}
                      >
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>
          </div>
          <div className="row">
            <button
              type="button"
              style={{ marginLeft: 15 }}
              name="delete"
              className="resetbutton"
              onClick={handleClick}
            >
              Delete
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default AddSubjectForm;