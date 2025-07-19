import React, { useState } from "react";
import "./App.css";

function CameraUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowUpload(true);
      setUploadSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/upload-receipt", {
        method: "POST",
        body: formData
      });

      if (res.ok) {
        setUploadSuccess(true);
        setSelectedFile(null);
        setShowUpload(false);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error");
    }
  };

  return (
    <div className="camera-upload-container">
      <h2 className="page-title">Upload Receipt</h2>

      <div className="privacy-banner">
        <strong>Privacy Notice:</strong> Your image is used only for automated analysis
        and is not saved on our servers.
      </div>

      <label className="file-select-label">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="file-input"
        />
        Open Camera
      </label>

      {showUpload && (
        <button className="upload-button" onClick={handleUpload}>
          Upload
        </button>
      )}

      {uploadSuccess && (
        <div className="success-banner">
          ✅ Receipt uploaded successfully!
        </div>
      )}
    </div>
  );
}

export default CameraUpload;
