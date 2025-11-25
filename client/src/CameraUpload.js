// src/CameraUpload.js
import React, { useState } from "react";
import { API_BASE } from "./apiConfig";

function CameraUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadSuccess(false);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Моля, първо изберете снимка на касова бележка.");
      return;
    }

    setUploading(true);
    setUploadSuccess(false);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_BASE}/upload-receipt`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let detail = "";
        try {
          const data = await response.json();
          detail = data.detail || JSON.stringify(data);
        } catch {
          detail = await response.text();
        }
        throw new Error(
          `Грешка при качване на бележката: ${response.status} ${detail}`
        );
      }

      // If backend returns JSON, you can parse/use it:
      // const data = await response.json();

      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || "Възникна неочаквана грешка при качването.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="camera-upload-container">
      <h1 className="page-title">Качи касова бележка</h1>

      <div className="privacy-banner">
        Използваме снимката само за да извлечем цените на продуктите. Не
        съхраняваме лични данни и не споделяме изображението с трети страни.
      </div>

      <label className="file-select-label">
        Избери снимка
        <input
          className="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>

      {previewUrl && (
        <div style={{ marginTop: "1rem", width: "100%" }}>
          <img
            src={previewUrl}
            alt="Преглед на касовата бележка"
            style={{
              width: "100%",
              maxHeight: 320,
              objectFit: "contain",
              borderRadius: 6,
            }}
          />
        </div>
      )}

      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={uploading || !selectedFile}
      >
        {uploading ? "Качване..." : "Качи бележката"}
      </button>

      {uploadSuccess && (
        <div className="success-banner">
          Success!
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "1rem",
            color: "crimson",
            whiteSpace: "pre-wrap",
            textAlign: "left",
            width: "100%",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default CameraUpload;
