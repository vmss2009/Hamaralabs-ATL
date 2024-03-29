import React from "react";
import { useParams } from "react-router-dom";
import {
  query,
  doc,
  onSnapshot,
  setDoc,
  collection,
  getDoc
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Bars } from "react-loader-spinner";
import { ReactMic } from "react-mic";

import { db } from "../../firebase/firestore";
import storage from "../../firebase/storage";
import MessageComp from "../ChatWithAdmin/MessageComp";
import Popup from "../../components/Popup";
import Sidebar from "../../components/Sidebar";
import { orderBy } from "lodash";

function Chat() {
  const { groupId } = useParams();

  const chatBoxRef = React.useRef(null); // Defining chatBoxRef as null initially

  const [popupEnabled, setPopupEnabled] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [data, setData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [groupName, setGroupName] = React.useState("");
  const [allowedUsers, setAllowedUsers] = React.useState([]);
  const [fileUpload, setFilesUpload] = React.useState(null);
  const [loadingTrigger, setLoadingTrigger] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [selectRole, setSelectRole] = React.useState("");

  // const [recording, setRecording] = React.useState(false);
  // const [audioURLState, setAudioURLState] = React.useState(null);
  // let mediaRecorder;

  function handleChange(event) {
    if (event.target.name === "messageValue") {
      setMessage(event.target.value);
    }
  }

  let uid;

  if (localStorage.auth != null) {
    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    uid = split[0];
  }

  async function handleSend() {
    if (fileUpload !== null) {
      setLoadingTrigger(true);
      const fileToBeUploaded = fileUpload["0"];
      const uploadingFileName =
        fileToBeUploaded.name.split(".")[0] +
        fileToBeUploaded.name.split(".")[1];
      console.log(fileToBeUploaded.name.split(".")[0]);
      console.log(Date.now());
      console.log(fileToBeUploaded.name.split(".")[1]);
      const contentType = fileUpload["0"].type;
      const fileRef = ref(storage, `groups/${groupId}/${uploadingFileName}`);
      await uploadBytesResumable(fileRef, fileUpload["0"] + Date.now());
      console.log(fileUpload["0"]);
      await getDownloadURL(fileRef).then(async (url) => {
        const dataArray = [...data];
        const timeStamp = Date.now();
        // Adding date and time to the database along with other content
        dataArray.push({
          senderRef: doc(db, "atlUsers", uid),
          content: contentType,
          fileName: uploadingFileName,
          fileURL: url,
          date: formatDate(timeStamp),
          time: formatTime(timeStamp),
        });
        console.log(dataArray.name);
        setMessage("");
        await setDoc(
          doc(db, "chats", groupId),
          {
            messages: dataArray,
          },
          { merge: true }
        );
        setData(dataArray);
      });
      document.querySelector("#file").value = "";
      setFilesUpload(null);
      setLoadingTrigger(false);
    } else if (message !== "") {
      const dataArray = [...data];
      const timeStamp = Date.now();
      // Adding date and time to the database along with other content
      dataArray.push({
        senderRef: doc(db, "atlUsers", uid),
        content: message,
        time: formatTime(timeStamp),
        date: formatDate(timeStamp),
      });
      setMessage("");
      await setDoc(
        doc(db, "chats", groupId),
        {
          messages: dataArray,
        },
        { merge: true }
      );
      console.log(dataArray);
      setData(dataArray);
    } else {
      alert("Please type a message");
    }
  }
  // fomatting the date to dd-mm-yyyy
  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);

    // Getting the date
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Construct the formatted date string
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  };

  // formatting time to hh:mm AM/PM
  const formatTime = (timeStamp) => {
    const date = new Date(timeStamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const meridiemString = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedTime = `${hours}:${minutes} ${meridiemString}`;

    return formattedTime;
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };
  async function handleAddToGroup() {
    if (!allowedUsers.includes(document.querySelector("#user").value)) {
      const docRef = doc(db, "chats", groupId);
      const usersRefs = [];
      allowedUsers.forEach((allowedUser) => {
        usersRefs.push(doc(db, "atlUsers", allowedUser));
      });
      usersRefs.push(
        doc(db, "atlUsers", document.querySelector("#user").value)
      );

      await setDoc(
        docRef,
        {
          users: [...usersRefs],
        },
        { merge: true }
      );

      const userRef = doc(
        db,
        "atlUsers",
        document.querySelector("#user").value
      );
      const userSnap = await getDoc(userRef);
      let chats;
      if (
        userSnap.data().chats === null ||
        userSnap.data().chats === undefined
      ) {
        chats = [];
        chats.push({ groupName: groupName, ref: doc(db, "chats", groupId) });
      } else {
        chats = userSnap.data().chats;
        chats.push({ groupName: groupName, ref: doc(db, "chats", groupId) });
      }
      await setDoc(
        userRef,
        {
          chats: chats,
        },
        { merge: true }
      );

      alert("Added user to chat group");
      setPopupEnabled(false);
    } else {
      alert("User is already in the chat group");
    }
  }

  function openPopUp() {
    setPopupEnabled(true);
  }

  function handleSelectFiles(event) {
    setFilesUpload(event.target.files);
  }

  async function onRecordingComplete(recordedBlob) {
    setLoadingTrigger(true);
    const uploadingFileName = Date.now() + ".mp3";
    const fileRef = ref(
      storage,
      `groups/${groupId}/voice-messages/${uploadingFileName}`
    );
    await uploadBytesResumable(fileRef, recordedBlob.blob);
    await getDownloadURL(fileRef).then(async (url) => {
      // Adding the date and time along wiht other content
      const dataArray = [...window.data];
      dataArray.push({
        senderRef: doc(db, "atlUsers", uid),
        content: "audio/mpeg",
        fileName: uploadingFileName,
        fileURL: url,
        date: formatDate(Date.now()),
        time: formatTime(Date.now()),
      });
      setMessage("");
      await setDoc(
        doc(db, "chats", groupId),
        {
          messages: dataArray,
        },
        { merge: true }
      );
      setMessage("");
      await setDoc(
        doc(db, "chats", groupId),
        {
          messages: dataArray,
        },
        { merge: true }
      );
      setLoadingTrigger(false);
      setData(dataArray);
    });
  }

  window.data = data;
  // Getting the unique dates of the chats to a set
  const sortDates = [...new Set(data.map((message) => message.date))];

  function handleRecordReq() {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  }

  document.title = "Group Chat | Digital ATL";

  // Using react useEffect hook when the data is effected
  React.useEffect(() => {
    // Scrolling to down when a new message is entered or the page is rendered newly
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [data]);

  React.useEffect(() => {
    const q = query(doc(db, "chats", groupId));

    onSnapshot(q, (snapshot) => {
      if (!snapshot.exists()) {
        window.location.href = "/chats";
      }
      const dataArray = [];

      const tempAllowedUsers = [];
      snapshot.data().users.forEach((user) => {
        tempAllowedUsers.push(user.path.replace("atlUsers/", ""));
      });

      setAllowedUsers(tempAllowedUsers);

      if (!tempAllowedUsers.includes(uid)) {
        window.location.href = "/chats";
      } else {
        setGroupName(snapshot.data().groupName);
        if ((snapshot.data().messages === null) || (snapshot.data().messages === undefined)) {
          setMessage("");
        } else {
          snapshot.data().messages.forEach((message) => {
            dataArray.push(message);
            setData(dataArray);
          });
        }
      }
    });

    const usersQuery = query(collection(db, "atlUsers"), orderBy("name"));

    onSnapshot(usersQuery, (snapshots) => {
      const usersData = [];
      snapshots.forEach((snap) => {
        const tempData = snap.data();
        tempData.uid = snap.id;
        usersData.push(tempData);
      });
      setUsers(usersData);
      console.log(usersData);
    });
  }, [groupId, uid]);

  return (
    <div className="container">
      <Sidebar />
      <link rel="stylesheet" href="/CSS/form.css" />
      <link rel="stylesheet" href="/CSS/report.css" />
      <Popup
        trigger={popupEnabled}
        setPopupEnabled={setPopupEnabled}
        closeAllowed={true}
      >
        <h1 style={{ display: "inline-block" }}>User: </h1>
        <select name="selectUserRole" id="selectUserRole" onChange={(event) => {setSelectRole(event.target.value)}}>
          <option value="" selected={true} disabled={true}>SELECT</option>
          <option value="mentor">Mentor</option>
          <option value="atlIncharge">Incharge</option>
          <option value="student">Student</option>
        </select>
        {
          (selectRole === "atlIncharge" || selectRole === "student" || selectRole === "mentor") ?
          <select name="user" id="user">
            {users.map((user, index) => {
              if (user.role === "atlIncharge" && selectRole === "atlIncharge") {
                return (
                  <option key={index} value={user.uid}>
                    {user.name}
                  </option>
                );
              } else if (user.role === "student" && selectRole === "student") {
                return (
                  <option key={index} value={user.uid}>
                    {user.name}
                  </option>
                );
              } else if (user.role === "mentor" && selectRole === "mentor") {
                return (
                  <option key={index} value={user.uid}>
                    {user.name}
                  </option>
                );
              } else {
                return null;
              }
            })}
          </select> : ""
        }
        <br />
        <button className="submitbutton" onClick={handleAddToGroup}>
          Add to chat group
        </button>
      </Popup>
      <Popup
        trigger={loadingTrigger}
        setPopupEnabled={setLoadingTrigger}
        closeAllowed={false}
      >
        {
          <Bars
            height="80"
            width="80"
            radius="9"
            color="black"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
        }
      </Popup>
      <div style={{ height: "10vh" }}>
        <h1 className="title">Chat {groupName} | Digital ATL</h1>
        <hr />
        <button
          className="resetbutton"
          style={{ position: "fixed", top: "0", right: "1.5rem" }}
          onClick={openPopUp}
        >
          <i className="fa-solid fa-user-plus"></i>
        </button>
      </div>
      <div
        className="messagesContainer"
        style={{
          height: "73vh",
          overflow: "auto",
        }}
      ref={chatBoxRef}
      >
        <div className="chat-box">
          {/* Getting the chats grouped by dates */}
          {sortDates.map((date, dateIndex) => (
            <div key={dateIndex}>
              <h2
                style={{
                  fontSize: "15px",
                  textAlign: "center",
                  margin: "5px auto",
                  backgroundColor: "#d7d2cb",
                  width: "100px",
                  padding: "5px",
                  borderRadius: "5px",
                }}
              >
                {date}
                {/* Adding date to heading field */}
              </h2>
              {/* Added the date and time to message component and displaying them grouped by dates using "filter"*/}
              {data
                .filter((message) => message.date === date)
                .map((message, messageIndex) => (
                  <MessageComp
                    id={messageIndex}
                    key={messageIndex}
                    fileName={message.fileName}
                    fileURL={message.fileURL}
                    senderUID={message.senderRef.path.replace("atlUsers/", "")}
                    content={message.content}
                    date={message.date}
                    time={message.time}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
      <div
        className="messageInputsContainer"
        style={{
          display: "flex",
        }}
      >
        <label
          htmlFor="file"
          className="resetbutton"
          style={{ cursor: "pointer", position: "relative", bottom: "0.4rem" }}
        >
          <i className="fa-solid fa-upload"></i>
        </label>
        <input
          type="file"
          name="file"
          id="file"
          className="resetbutton"
          accept=".pdf, .mp3, .mp4, .jpg, .jpeg"
          onChange={handleSelectFiles}
          onMouseEnter={handleSend}
          style={{
            display: "none",
          }}
        />
        <div className="micContainer" style={{ display: "none" }}>
          <ReactMic
            record={isRecording}
            onStop={onRecordingComplete}
            strokeColor="#000"
            backgroundColor="#fff"
            mimeType="audio/mpeg"
          />
        </div>
        {isRecording ? (
          <button
            className="resetbutton"
            onClick={handleRecordReq}
            style={{ position: "relative", bottom: "7px", left: "5px" }}
          >
            <i className="fa-solid fa-microphone-slash"></i>
          </button>
        ) : (
          <button
            className="submitbutton"
            onClick={handleRecordReq}
            style={{ position: "relative", bottom: "7px", left: "5px" }}
          >
            <i className="fa-solid fa-microphone"></i>
          </button>
        )}
        {/* autoFocus attribute is added */}
        <input
          type="text"
          name="messageValue"
          id="messageValue"
          placeholder="Type your message"
          autoComplete="off"
          onChange={handleChange}
          value={message}
          onKeyPress={handleKeyPress}
          autoFocus
          style={{
            padding: "0.3rem",
            fontSize: "1.2rem",
            width: "200%",
            border: "3px solid rgb(94, 94, 94)",
            borderRadius: "10px",
            outline: "none",
            textAlign: "left",
            transition: "0.3s",
            margin: "0.5rem",
          }}
        />
        <button
          className="submitbutton"
          onClick={handleSend}
          style={{
            position: "relative",
            bottom: "0.5rem",
            display: "flex",
          }}
        >
          <i
            className="fa-solid fa-paper-plane"
            style={{ marginRight: "10px" }}
          ></i>{" "}
          Send
        </button>
      </div>
      <div style={{ fontSize: "1rem" }}>
        {fileUpload !== null
          ? fileUpload["0"].name + " file is selected"
          : "No file is selected"}
      </div>
    </div>
  );
}

export default Chat;