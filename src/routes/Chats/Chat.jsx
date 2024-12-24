import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  query,
  doc,
  onSnapshot,
  setDoc,
  collection,
  getDoc,
  deleteDoc, addDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Bars } from "react-loader-spinner";
import { ReactMic } from "react-mic";
import axios from "axios";
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
    const groupData = await getDoc(groupRef);
    const mentorsRef = [];
    for (const memberRef of groupData.data().users) {
      const memberData = await getDoc(memberRef);
      if (memberData.data().role === "mentor" && memberData.id !== uid) {
        mentorsRef.push(memberRef);
      }
    }
    if (fileUpload !== null) {
      setLoadingTrigger(true);
      const fileToBeUploaded = fileUpload["0"];
      const uploadingFileName = fileToBeUploaded.name;
      const contentType = fileUpload["0"].type;
      const fileRef = ref(storage, `groups/${groupId}/${uploadingFileName}`);
      await uploadBytesResumable(fileRef, fileToBeUploaded);
      const url = await getDownloadURL(fileRef);
      try {
        const messageCollectionRef = collection(db, "chats", groupId, "messages");
        const timeStamp = Date.now();
        await addDoc(messageCollectionRef, {
          senderRef: doc(db, "atlUsers", uid),
          content: contentType,
          fileName: uploadingFileName,
          fileURL: url,
          timeStamp: timeStamp,
        });
        setMessage("");
      } catch (err) {
        console.log(err);
      }
      const groupData = await getDoc(groupRef);
      const senderRef = doc(db, "atlUsers", uid);
      const senderData = await getDoc(senderRef);
      await notificationsToUsers(
          mentorsRef,
          "New Message",
          `${groupData.data().groupName} - ${senderData.data().name} - ${message}`
      );
      await notificationsToAdmins(
          "New Message",
          `${groupData.data().groupName} - ${senderData.data().name} - ${message}`
      );
      document.querySelector("#file").value = "";
      setFilesUpload(null);
      setLoadingTrigger(false);
    } else if (message !== "") {
      const groupData = await getDoc(groupRef);
      const senderRef = doc(db, "atlUsers", uid);
      const senderData = await getDoc(senderRef);
      const messageCollectionRef = collection(db, "chats", groupId, "messages");
      const timeStamp = Date.now();
      await addDoc(messageCollectionRef, {
        senderRef: doc(db, "atlUsers", uid),
        content: message,
        timeStamp: timeStamp,
      });
      setMessage("");
      await notificationsToUsers(
          mentorsRef,
          "New Message",
          `${groupData.data().groupName} - ${senderData.data().name} - ${message}`
      );
      await notificationsToAdmins(
          "New Message",
          `${groupData.data().groupName} - ${senderData.data().name} - ${message}`
      );
    } else {
      alert("Please type a message");
    }
  };

  async function sendCall () {
    try {
      await axios.get("https://us-central1-hamaralabs-prod.cloudfunctions.net/phoneCall/call")
          .then((data) => {
            console.log(data);
          });
    } catch (error) {
      console.log(error);
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
      const timeStamp = Date.now();
      const messageCollectionRef = collection(db, "chats", groupId, "messages");
      await addDoc(messageCollectionRef, {
        senderRef: doc(db, "atlUsers", uid),
        content: "audio/mpeg",
        fileName: uploadingFileName,
        fileURL: url,
        timeStamp: timeStamp,
      });
      setMessage("");
      setLoadingTrigger(false);
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

      const tempAllowedUsers = [];
      snapshot.data().users.forEach((user) => {
        tempAllowedUsers.push(user.path.replace("atlUsers/", ""));
      });

      setAllowedUsers(tempAllowedUsers);

      if (!tempAllowedUsers.includes(uid)) {
        window.location.href = "/chats";
      } else {
        setGroupName(snapshot.data().groupName);
        const messagesCollection = query(collection(db, "chats", groupId, "messages"), orderBy("timeStamp", "asc"));
        onSnapshot(messagesCollection, (snapshot) => {
          const dataArray = [];
          snapshot.forEach((message) => {
            const temp = message.data();
            temp.id = message.id;
            dataArray.push(temp);
          });
          setData(dataArray);
        });
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

  const deleteMessage = async (id) => {
    try {
      setLoadingTrigger(true);
      const chatDocRef = doc(db, "chats", groupId, "messages", id);
      await deleteDoc(chatDocRef);
      setLoadingTrigger(false);
    } catch (error) {
      alert("Oops! Something went wrong! Please try again");
    }
  };

  // Function to display messages grouped by dates
  const messageList = () => {
    let refDate = ""; // Current date reference
    const sortedData = [...data].sort((a, b) => a.timeStamp - b.timeStamp); // Sort messages by timestamp

    return sortedData.map((message, messageIndex) => {
      const timeStamp = message.timeStamp;
      const isDelete = (Date.now() - timeStamp) / 1000 < 120;
      const messageDate = new Date(timeStamp).toDateString();

      // Check if the date has changed or if it's the first message
      const showDate = refDate !== messageDate;
      refDate = messageDate;

      return (
          <div key={messageIndex}>
            {showDate && (
                <div style={{ textAlign: "center" }}>
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
                    {formatDate(timeStamp)}
                  </h2>
                </div>
            )}
            <div>
              <MessageComp
                  id={messageIndex}
                  key={messageIndex}
                  fileName={message.fileName}
                  fileURL={message.fileURL}
                  senderUID={message.senderRef.path.replace("atlUsers/", "")}
                  content={message.content}
                  date={message.date}
                  time={formatTime(message.timeStamp)}
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
                        deleteMessage(message.id);
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