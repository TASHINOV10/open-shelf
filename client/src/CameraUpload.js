import React, { useState } from "react";
import "./App.css";

function CameraUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    // ⚠️ The key "file" must match your FastAPI param name (e.g., file: UploadFile)
    formData.append("file", selectedFile);

    try {
      setUploading(true);

      // ✅ IMPORTANT: use a RELATIVE path so CRA dev server proxies to FastAPI
      // If your FastAPI route is different, change '/upload-receipt' accordingly

      const res = await fetch("http://192.168.137.1:8000/upload-receipt", { method: "POST", body: formData });


      if (res.ok) {
        setUploadSuccess(true);
        setSelectedFile(null);
        setShowUpload(false);
      } else {
        const text = await res.text().catch(() => "");
        alert(`Upload failed (${res.status}). ${text}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error. See console for details.");
    } finally {
      setUploading(false);
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
        <button className="upload-button" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      )}

      {uploadSuccess && (
        <div className="success-banner">✅ Receipt uploaded successfully!</div>
      )}
    </div>
  );
}

export default CameraUpload;
