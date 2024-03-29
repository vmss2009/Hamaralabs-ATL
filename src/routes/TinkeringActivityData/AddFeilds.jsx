import React from "react";
import { Bars } from "react-loader-spinner";
import { addSubject, getSubjects, deleteSubject, addTopic, getTopics, deleteTopic, addSubTopic, getSubtopics, deleteSubtopic } from "../../firebase/firestore";
import Popup from "../../components/Popup";
import Sidebar from "../../components/Sidebar";

function AddSubjectForm() {
  const [storeSubject, setStoreSubject] = React.useState("");
  const [storeTopic, setStoreTopic] = React.useState("");
  const [showTopic, setShowTopic] = React.useState(false);
  const [showSubTopic, setShowSubTopic] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [subTopic, setSubTopic] = React.useState(""); 
  const [loadingTrigger, setLoadingTrigger] = React.useState(false);
  const [listOfSubjectData, setListOfSubjectData] = React.useState([]);
  const [listOfTopicData, setListOfTopicData] = React.useState([]);
  const [dropdownKey, setDropdownKey] = React.useState(Date.now()); 
  const [listOfSubTopicData, setListOfSubTopicData] = React.useState([]);

  React.useEffect(() => {
    // Retrieve updated data after adding a subject
    getDetailsOfSubject();


    // Set document title
    document.title = "Tinkering Activity Data Form | Digital ATL";
  }, [subject]);

  React.useEffect(() => {
    // Retrieve updated data after adding a subject
    if(storeSubject !== "") {
      getDetailsOfTopic();
    }
    // Set document title
    document.title = "Tinkering Activity Data Form | Digital ATL";
  }, [storeSubject, storeTopic, topic]);

  React.useEffect(() => {
    // Retrieve updated data after adding a subject
    if(storeSubject !== "") {
      getDetailsOfSubTopic();
    }
    // Set document title
    document.title = "Tinkering Activity Data Form | Digital ATL";
  }, [storeSubject, storeTopic, topic,subTopic]);

  function getDetailsOfSubject() {
    getSubjects()
        .then((docSnaps) => {
            const dataArray = docSnaps.map((docSnap) => {
                const data = docSnap.data();
                return { id: docSnap.id, name: data.name };
            });
            console.log("Data Array:", dataArray);
            setListOfSubjectData(dataArray.sort((a, b) => a.name.localeCompare(b.name)));
        })
        .catch((err) => {
            console.log("Error:", err);
        });
  }

  function getDetailsOfTopic(){
    getTopics(storeSubject)
        .then((docSnaps) => {
          const dataArray = docSnaps.map((docSnap) => {
            const data = docSnap.data();
            return { id: docSnap.id, name: data.name };
        });

        console.log("Data Array:", dataArray);
        setListOfTopicData(dataArray.sort((a, b) => a.name.localeCompare(b.name)));
        })
        .catch((err) => {
          console.log("Error:", err);
        });
  }

  function getDetailsOfSubTopic(){
    getSubtopics(storeSubject, storeTopic)
        .then((docSnaps) => {
          const dataArray = docSnaps.map((docSnap) => {
            const data = docSnap.data();
            return { id: docSnap.id, name: data.name };
        });

        console.log("Data Array:", dataArray);
        setListOfSubTopicData(dataArray.sort((a, b) => a.name.localeCompare(b.name)));
        })
        .catch((err) => {
          console.log("Error:", err);
        });
  }

  function handleChange(event) {
    if (event && event.target.name === "subject") {
      setStoreSubject(event.target.value);
      setShowTopic(false);
      setShowSubTopic(false);
    } else if (event && event.target.name === "topic") {
      setStoreTopic(event.target.value);
      setShowSubTopic(false);
    } else if (event && event.target.name === "subName") {
      setSubject(event.target.value);
    } else if(event && event.target.name === "topicName") {
      setTopic(event.target.value);
    } else if(event && event.target.name === "subTopicName") {
      setSubTopic(event.target.value);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const subjectExists = listOfSubjectData.some((data) => data.name === subject);
    const topicExists = listOfTopicData.some((data) => data.name === topic);
    const subTopicExists = listOfSubTopicData.some((data) => data.name === subTopic);

    if (!subjectExists && event.target.name === "subject" && subject !== "") {
      await addSubject(subject)
      .then(() => {
        alert("Added successfully!!");
        setSubject(""); // Clear the subject field
        setStoreSubject(""); // Reset the dropdown selection
        setStoreTopic("");
        setShowTopic(false);
        setShowSubTopic(false);
        getDetailsOfSubject(); // Update the list of subjects
        setDropdownKey(Date.now()); // Force re-render of the dropdown
      })
      .catch((err) => {
        console.log(err);
        alert("Adding data failed! Please try again.");
      });
    } else if (!topicExists && event.target.name === "topic" && topic !== "") {
      await addTopic(topic, storeSubject)
        .then(() => {
          alert("Added successfully");
          setTopic("");
          setStoreTopic("");
          setShowSubTopic(false);
        })
        .catch((err) => {
          console.log(err);
          alert("Add data failed! Please try again.");
        });
    } else if (!subTopicExists && event.target.name === "subTopic" && subTopic !== "") {
      await addSubTopic(subTopic, storeSubject, storeTopic)
        .then(() => {
          alert("Added successfully");
          setSubTopic("");
        })
        .catch((err) => {
          console.log(err);
          alert("Add data failed! Please try again.");
        });
    } else {
      alert("Record already exists!");
    }
  }

  async function deleteFieldSubject(docId) {
    setLoadingTrigger(true);
    getDetailsOfTopic();
    if(window.confirm("Do you really want to delete this record ?")) {
      if (listOfTopicData.length > 0) {
        alert("Sorry, please first delete the underlying topics and subtopics");
      } else if (storeSubject === "") {
        alert("Please select the subject you want to delete");
      } else {
        await deleteSubject(docId);
        listOfSubjectData.forEach((value, index) => {
          if(value.id === docId) {
            console.log(listOfSubjectData);
            listOfSubjectData.splice(index, 1);
            console.log(listOfSubjectData);
          }
        });
        alert("Deleted Successfully!!");
        setStoreSubject("");
      }
    }
    setLoadingTrigger(false);
  }

  async function deleteFieldTopic(docId) {
    setLoadingTrigger(true);
    getDetailsOfSubTopic();
    if(window.confirm("Do you really want to delete this record ?")) {
      if (listOfSubTopicData.length > 0) {
        alert("Sorry, please first delete the underlying subtopics");
      } else if (storeTopic === "") {
        alert("Please select the topic you want to delete");
      } else {
        await deleteTopic(docId, storeSubject);
        listOfTopicData.forEach((value, index) => {
          if(value.id === docId) {
            console.log(listOfTopicData);
            listOfTopicData.splice(listOfTopicData.indexOf(index), 1);
            console.log(listOfTopicData);
          }
        });
        alert("Deleted Successfully!!");
        setStoreTopic("");
      }
    }
    setLoadingTrigger(false);
  }

  async function deleteFieldSubTopic(docId) {
    setLoadingTrigger(true);
    if(window.confirm("Do you really want to delete this record ?")) {
      await deleteSubtopic(docId, storeSubject, storeTopic);
      listOfSubTopicData.forEach((value, index) => {
        if(value.id === docId) {
          console.log(listOfSubTopicData);
          listOfSubTopicData.splice(listOfSubTopicData.indexOf(index), 1);
          console.log(listOfSubTopicData);
        }
      });
      alert("Deleted Successfully!!");
    }
    setLoadingTrigger(false);
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
        <div className="school-title">Add Subject</div>
        <hr />
        <div className="formContainer">
          <div className="row">
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
                value={subject}
              />
              <button
                type="submit"
                className="submitbutton"
                name="subject"
                onClick={handleSubmit}
              >
                Add
              </button>
              <br/>
              <label htmlFor="subName">
                <strong>Select Subject : </strong>{" "}
              </label>
              <select
                  key={dropdownKey}
                  name="subject"
                  id="subject"
                  className="form-inp"
                  onChange={handleChange}
                >
                <option value="">Select</option>
                {listOfSubjectData.map((data, index) => (
                  <option key={index} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="column">
              <h3 htmlFor="Display">{"List of subjects"}</h3>
              <table>
                <tbody>
                  {listOfSubjectData.map((data, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          fontSize: 20,
                          margin: 5,
                        }}
                      >
                        {data.name}
                        <input type='button' value="Delete" onClick={() => {deleteFieldSubject(data.id)}}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
        {
        showTopic === false ? 
        <button 
          className="submitbutton"
          onClick={() => {
            if(storeSubject === "") {
              alert("Please choose a subject !");
            } else {
              setShowTopic(true)
            }
          }}
        >
            Topics
        </button> : ""
        }
        {
          showTopic && storeSubject !== "" ? 
          <>
            <div className="formContainer">
              <div className="row">
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
                    value={topic}
                  />
                  <label htmlFor="topicName">
                  <button
                    type="submit"
                    className="submitbutton"
                    name="topic"
                    onClick={handleSubmit}
                  >
                    Add
                  </button> 
                  <br/>
                  <strong>Select Topic : </strong>{" "}
                  </label>
                  <select
                      name="topic"
                      id="topic"
                      className="form-inp"
                      onChange={handleChange}
                    >
                    <option value="">Select</option>
                    {listOfTopicData.map((data, index) => (
                      <option key={index} value={data.id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="column">
                  <h3 htmlFor="Display">{"List of topics"}</h3>
                  <table>
                    <tbody>
                      {listOfTopicData.map((data, index) => (
                        <tr key={index}>
                          <td
                            style={{
                              fontSize: 20,
                              margin: 5,
                            }}
                          >
                            {data.name}
                            <input type='button' value="Delete" onClick={() => {deleteFieldTopic(data.id)}}/>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {
            showSubTopic === false ? 
            <button 
              className="submitbutton"
              onClick={() => {
                if(storeTopic === "") {
                  alert("Please choose a Topic !");
                } else {
                  setShowSubTopic(true)
                }
              }}
            >
                SubTopics
            </button> : ""
            }
            {
            showSubTopic && storeTopic !== "" ? 
            <>
              <div className="formContainer">
                <div className="row">
                  <div className="column">
                    <br/>
                    <label htmlFor="topicName">
                      <strong>SubTopic Name:</strong>{" "}
                    </label>
                    <input
                      type="text"
                      name="subTopicName"
                      id="subTopicName"
                      placeholder="Enter the Sub Topic Name"
                      className="form-inp"
                      onChange={handleChange}
                      value={subTopic}
                    />
                    <button
                      type="submit"
                      className="submitbutton"
                      name="subTopic"
                      onClick={handleSubmit}
                    >
                      Add
                    </button>
                  </div>
                  <div className="column">
                    <h3 htmlFor="Display">{"List of Sub Topics"}</h3>
                    <table>
                      <tbody>
                        {listOfSubTopicData.map((data, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                fontSize: 20,
                                margin: 5,
                              }}
                            >
                              {data.name}
                              <input type='button' value="Delete" onClick={() => {deleteFieldSubTopic(data.id)}}/>                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>  
            : ""
          }
          </>  
          : ""
        }
      </form>
    </div>
  );
}

export default AddSubjectForm;