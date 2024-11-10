import React from "react";
import { doc, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firestore";

function MessageComp(props) {
  const [senderData, setSenderData] = React.useState({});
  let uid;
  const ref = React.useRef();

  React.useEffect(() => {
    const q = query(doc(db, "atlUsers", props.senderUID));
    onSnapshot(q, (snapshot) => {
      setSenderData(snapshot.data());
    });
  }, []);

  if (localStorage.auth != null) {
    let decodedAuth = atob(localStorage.auth);
    let split = decodedAuth.split("-");
    uid = split[0];
  }

  const isStringContent = typeof props.content === "string";

  return (
      <div
          className={
            props.senderUID !== uid
                ? "receivedMessageContainer"
                : "sentMessageContainer"
          }
      >
        <div
            className={
              props.senderUID === uid ? "messageBox sent" : "messageBox received"
            }
            style={{ display: "block" }}
        >
          {props.senderUID !== uid ? (
              <div
                  className="name"
                  style={{
                    display: "block",
                    textAlign: "left",
                    fontSize: "1.2rem",
                    color: "#fff",
                  }}
              >
                {senderData.name}
              </div>
          ) : undefined}
          <div
              className="content"
              style={{ display: "block", textAlign: "left" }}
          >
            {isStringContent && props.content.includes("image/") ? (
                <img
                    src={props.fileURL}
                    alt={props.fileName}
                    style={{ maxHeight: "50vh" }}
                />
            ) : isStringContent && props.content.replace("application/") !== props.content ||
            isStringContent && props.content.replace("text/") !== props.content ? (
                <a href={props.fileURL} rel="noreffer" target="__blank">
                  {props.fileName}
                </a>
            ) : isStringContent && props.content === "audio/mpeg" ? (
                <audio src={props.fileURL} controls={true} />
            ) : isStringContent && props.content === "video/mp4" ? (
                <video
                    src={props.fileURL}
                    style={{ maxHeight: "45vh" }}
                    controls={true}
                ></video>
            ) : (
                props.content
            )}
            <span
                style={{ fontSize: "10px", marginLeft: "10px", textAlign: "right" }}
            >
            {props.time}
          </span>
            {props.children}
          </div>
        </div>
      </div>
  );
}

export default MessageComp;