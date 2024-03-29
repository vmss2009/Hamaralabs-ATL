// UploadedFilesList.js
import React from "react";

function UploadedFilesList({ fileURLs, onRemoveFile }) {
  return (
    <div>
      <h3>Uploaded Files:</h3>
      <ul>
        {fileURLs.map((fileURL, index) => (
          <li key={index}>
            <a href={fileURL} target="_blank" rel="noreferrer">
              {fileURL}
            </a>
            <button onClick={() => onRemoveFile(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UploadedFilesList;
