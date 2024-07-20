import React from "react";
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

import MessageComp from "./MessageComp";
import { db } from "../../firebase/firestore";
import Sidebar from "../../components/Sidebar";

function AdminIndividualChat() {
  const { userId } = useParams();

  const chatBoxRef = React.useRef(null); // Defining chatBoxRef as null initially

  const [message, setMessage] = React.useState("");
  const [data, setData] = React.useState([]);
  const [user, setUser] = React.useState("a user");

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

  // Using react useEffect hook when the data is effected
  React.useEffect(() => {
    // Scrolling to down when a new message is entered or the page is rendered newly
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [data]);

  React.useEffect(() => {
    const q = query(doc(db, "chatWithAdmin", userId));

    onSnapshot(q, (snapshot) => {
      const dataArray = [];
      snapshot.data().messages.forEach((message) => {
        dataArray.push(message);
        setData(dataArray);
      });
    });

    const q2 = query(doc(db, "atlUsers", userId));

    onSnapshot(q2, (snap) => {
      setUser(snap.data().name);
    });
  }, [userId]);

  async function handleSend() {
    if (message !== "") {
      const dataArray = data;
      //   Adding the date and time fields in the data array..
      dataArray.push({
        senderUID: uid,
        content: message,
        date: formatDate(Date.now()),
        time: formatTime(Date.now()),
      });
      console.log(dataArray);
      setMessage("");
      await setDoc(doc(db, "chatWithAdmin", userId), {
        messages: dataArray,
      });
      setData(dataArray);
    } else {
      alert("Please type a message");
    }
  }
  window.data = data;

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

  // Function to delete a chat message
  const deleteMessage = async (index) => {
    try {
      const chatDocRef = doc(db, "chatWithAdmin", userId);
      const chatDocSnapshot = await getDoc(chatDocRef);
      const msgArray = chatDocSnapshot.data().messages;
      const updatedMsgArray = [
        ...msgArray.slice(0, index),
        ...msgArray.slice(index + 1),
      ];
      await updateDoc(chatDocRef, { messages: updatedMsgArray });
      setData(updatedMsgArray);
    } catch (error) {
      alert("Oops! Something went wrong! Please try again");
    }
  };

  // Function to display messages grouped by dates
  const messageList = () => {
    let refDate = ""; // Current date reference
    return data.map((message, messageIndex) => {
      const timeStamp = getTimestamp(message.date, message.time);
      const isDelete = (Date.now() - timeStamp.getTime())/1000 < 120;
      return <div>
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
            senderUID={message.senderUID}
            content={message.content}
            date={message.date}
            time={message.time}
          >
            { role === "admin" || (uid === message.senderRef.path.replace("atlUsers/", "") && isDelete) ?
            <span>
              <button // Button that deleted the message
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
                onClick={() => {if(window.confirm("Do you want to delete this message ?"))deleteMessage(messageIndex)}}
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </span> : ""
            }
          </MessageComp>
        </div>
      </div>
  });
  };
  document.title = "Chat with Admin | Digital ATL";

  return (
    <div className="container">
      <Sidebar />
      <link rel="stylesheet" href="/CSS/form.css" />
      <div style={{ height: "10vh" }}>
        <h1 className="title">Chat With Admin | Digital ATL</h1>
        <p style={{ fontSize: "1rem" }}>
          You are currently chatting with {user}
        </p>
        <hr />
      </div>
      <div
        className="messagesContainer"
        style={{
          height: "73vh",
          overflow: "auto",
        }}
        ref={chatBoxRef}
      >
        <div>
          {/* Method call for getting the chat messages */}
          {messageList()}
        </div>
      </div>
      <div
        className="messageInputsContainer"
        style={{
          width: "93%",
          display: "flex",
        }}
      >
        {/* autoFocus attribute is added */}
        <input
          type="text"
          name="messageValue"
          id="messageValue"
          placeholder="Type your message"
          onChange={handleChange}
          value={message}
          style={{
            padding: "0.3rem",
            fontSize: "1.2rem",
            width: "95%",
            border: "3px solid rgb(94, 94, 94)",
            borderRadius: "10px",
            outline: "none",
            textAlign: "left",
            transition: "0.3s",
            margin: "0.5rem",
          }}
          onKeyPress={handleKeyPress}
          autoFocus
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
    </div>
  );
}

export default AdminIndividualChat;