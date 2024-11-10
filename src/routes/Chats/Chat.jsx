import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  query,
  doc,
  onSnapshot,
  setDoc,
  collection,
  getDoc,
  updateDoc,
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
import {
  notificationsToAdmins,
  notificationsToUsers,
} from "../../firebase/cloudmessaging";

function Chat() {
  const { groupId } = useParams();

  const chatBoxRef = React.useRef(null); // Defining chatBoxRef as null initially

  const [popupEnabled, setPopupEnabled] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [data, setData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [groupName, setGroupName] = React.useState("");
  const [allowedUsers, setAllowedUsers] = React.useState([]);
  const [groupMembers, setGroupMembers] = React.useState([]);
  const [showGroupMembers, setShowGroupMembers] = React.useState(false);
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
  let role;

  if (localStorage.auth != null) {
    let decodedAuth = atob(localStorage.auth);

    let split = decodedAuth.split("-");

    uid = split[0];
    role = split[2];
  }

  const groupRef = doc(db, "chats", groupId);

  const handleSend = async () => {
    if (fileUpload !== null) {
      setLoadingTrigger(true);
      const fileToBeUploaded = fileUpload["0"];
      const uploadingFileName = fileToBeUploaded.name;
      const contentType = fileUpload["0"].type;
      const fileRef = ref(storage, `groups/${groupId}/${uploadingFileName}`);
      await uploadBytesResumable(fileRef, fileToBeUploaded);
      const url = await getDownloadURL(fileRef);
      console.log(url);
      try {
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
        console.log(dataArray.fileURL);
        setMessage("");
        await setDoc(
          groupRef,
          {
            messages: dataArray,
          },
          { merge: true }
        );
        setData(dataArray);
      } catch (err) {
        console.log(err);
      }
      const groupData = await getDoc(groupRef);
      const senderRef = doc(db, "atlUsers", uid);
      const senderData = await getDoc(senderRef);
      await notificationsToAdmins(
        "New Message",
        `${groupData.data().groupName} - ${senderData.data().name} - ${message}`
      );
      document.querySelector("#file").value = "";
      setFilesUpload(null);
      setLoadingTrigger(false);
    } else if (message !== "") {
      const dataArray = [...data];
      const timeStamp = Date.now();
      const groupData = await getDoc(groupRef);
      const senderRef = doc(db, "atlUsers", uid);
      const senderData = await getDoc(senderRef);

      // Adding date and time to the database along with other content
      dataArray.push({
        senderRef: doc(db, "atlUsers", uid),
        content: message,
        time: formatTime(timeStamp),
        date: formatDate(timeStamp),
      });
      setMessage("");
      await setDoc(
        groupRef,
        {
          messages: dataArray,
        },
        { merge: true }
      );
      const mentorsRef = [];
      for (const memberRef of groupData.data().users) {
        const memberData = await getDoc(memberRef);
        if (memberData.data().role === "mentor" && memberData.id !== uid) {
          mentorsRef.push(memberRef);
        }
      }
      await notificationsToUsers(
        mentorsRef,
        "New Message",
        `${groupData.data().groupName} - ${senderData.data().name} - ${message}`
      );
      await notificationsToAdmins(
        "New Message",
        `${groupData.data().groupName} - ${senderData.data().name} - ${message}`
      );

      setData(dataArray);
    } else {
      alert("Please type a message");
    }
  };
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

  function getTimestamp(date, time) {
    // Split the date to get day, month, and year
    const [day, month, year] = date.split("-").map(num => parseInt(num, 10));
  
    // Split the time to get hours and minutes, and adjust for AM/PM
    let [hours, minutesPart] = time.split(":");
    let minutes = parseInt(minutesPart, 10);
    let ampm = minutesPart.slice(-2);
    hours = parseInt(hours, 10);
  
    // Convert 12-hour clock to 24-hour clock based on AM/PM
    if (ampm === "PM" && hours < 12) {
      hours += 12;
    } else if (ampm === "AM" && hours === 12) {
      hours = 0;
    }
  
    // Create a Date object
    const dateTime = new Date(year, month - 1, day, hours, minutes);
    
    return dateTime;
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
  function handleRecordReq() {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
  }

  showMembers();

  async function showMembers() {
    const docRef = doc(db, "chats", groupId); // Assuming groupId is accessible in this component
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const usersRefs = data.users;
      const members = await Promise.all(
        usersRefs.map(async (userRef) => {
          const userDoc = await getDoc(userRef);
          return [userDoc.data().name, userDoc.data().role]; // Assuming each user document has a 'name' field
        })
      );
      setGroupMembers(members);
    } else {
      console.log("Group document does not exist");
    }
  }

  const convertToHyperlinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
            <a key={index} href={part} target="_blank" rel="noreferrer">
              {part}
            </a>
        );
      }
      return part;
    });
  };

  document.title = "Group Chat | Digital ATL";

  // Using react useEffect hook when the data is effected
  useEffect(() => {
    // Scrolling to down when a new message is entered or the page is rendered newly
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [data]);

  useEffect(() => {
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
        if (
          snapshot.data().messages === null ||
          snapshot.data().messages === undefined
        ) {
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
    });
  }, [groupId, uid]);

  const deleteMessage = async (index) => {
    try {
      setLoadingTrigger(true);
      const chatDocRef = doc(collection(db, "chats"), groupId);
      const chatDocSnapshot = await getDoc(chatDocRef);
      const msgArray = chatDocSnapshot.data().messages;
      const updatedMsgArray = [
        ...msgArray.slice(0, index),
        ...msgArray.slice(index + 1),
      ];
      await updateDoc(chatDocRef, { messages: updatedMsgArray });
      setData(updatedMsgArray);
      await setLoadingTrigger(false);
    } catch (error) {
      alert("Oops! Something went wrong! Please try again");
    }
  };

  // Function to display messages grouped by dates
  const messageList = () => {
    let refDate = ""; // Current date reference
    return data.map((message, messageIndex) => {
      const timeStamp = getTimestamp(message.date, message.time);
      const isDelete = (Date.now() - timeStamp.getTime()) / 1000 < 120;
      return (
          <div key={messageIndex}>
            <div style={{ textAlign: "center" }}>
              {refDate !== message.date && (
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
                    {message.date}
                  </h2>
              )}
              <span style={{ display: "none" }}>
            {refDate !== message.date && (refDate = message.date)}
          </span>
            </div>
            <div>
              <MessageComp
                  id={messageIndex}
                  key={messageIndex}
                  fileName={message.fileName}
                  fileURL={message.fileURL}
                  senderUID={message.senderRef.path.replace("atlUsers/", "")}
                  content={convertToHyperlinks(message.content)}
                  date={message.date}
                  time={message.time}
              >
                {role === "admin" ||
                (uid === message.senderRef.path.replace("atlUsers/", "") && isDelete) ? (
                    <span>
                <button
                    type="button"
                    style={{
                      border: "none",
                      cursor: "pointer",
                      padding: "5px",
                      background: "rgb(218, 218, 218)",
                      borderRadius: "5px",
                      backdropFilter: "blur(3px);",
                    }}
                    id="deleteButton"
                    onClick={() => {
                      if (window.confirm("Do you want to delete this message?"))
                        deleteMessage(messageIndex);
                    }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </span>
                ) : (
                    ""
                )}
              </MessageComp>
            </div>
          </div>
      );
    });
  };

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
        <select
          name="selectUserRole"
          id="selectUserRole"
          onChange={(event) => {
            setSelectRole(event.target.value);
          }}
        >
          <option value="" selected={true} disabled={true}>
            SELECT
          </option>
          <option value="mentor">Mentor</option>
          <option value="atlIncharge">Incharge</option>
          <option value="student">Student</option>
        </select>
        {selectRole === "atlIncharge" ||
        selectRole === "student" ||
        selectRole === "mentor" ? (
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
          </select>
        ) : (
          ""
        )}
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
          style={{ position: "fixed", top: "0", right: "10rem" }}
          onClick={() => setShowGroupMembers((prevState) => !prevState)}
        >
          <span>
            <i class="fa-solid fa-users-line"></i>
            <span style={{ fontSize: "15px", marginLeft: "5px" }}>
              Group Members {showGroupMembers}
            </span>
          </span>
          {showGroupMembers ? (
            <i class="fa-solid fa-caret-up"></i>
          ) : (
            <i class="fa-solid fa-caret-down"></i>
          )}
          {showGroupMembers && (
            <ul
              style={{
                listStyle: "none",
                textAlign: "left",
              }}
            >
              {groupMembers.map((member, index) => (
                <li key={index} style={{ marginTop: "5px" }}>
                  {member[0]} - {member[1]}
                </li>
              ))}
            </ul>
          )}
        </button>
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
        <div className="chat-box">{messageList()}</div>
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
          accept="*/*"
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