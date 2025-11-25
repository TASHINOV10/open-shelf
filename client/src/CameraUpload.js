import React, { useState, useEffect } from "react";
import "./App.css";

export default function CameraUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // create / revoke preview URL
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  function handleFileChange(e) {
    setUploadSuccess(false);
    setError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(f);
  }

  async function handleUpload() {
    setError(null);
    setUploadSuccess(false);

    if (!selectedFile) {
      setError("No file selected");
      return;
    }

    const formData = new FormData();
    // MUST match backend field name: "file"
    formData.append("file", selectedFile, selectedFile.name);

    try {
      setUploading(true);

      const res = await fetch("/upload-receipt", {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type header; browser will set multipart boundary.
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText || "");
        throw new Error(`Upload failed: ${res.status} ${text}`);
      }

      // backend returns JSON on success; ignore parse errors
      const json = await res.json().catch(() => ({}));
      console.log("Upload response:", json);

      setUploadSuccess(true);
      setSelectedFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleClear() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setUploadSuccess(false);
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h3>Upload Receipt</h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {previewUrl && (
        <div style={{ marginTop: 12 }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{ width: "100%", maxHeight: 300, objectFit: "contain", border: "1px solid #ddd", borderRadius: 4 }}
          />
        </div>
      )}

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          style={{ padding: "8px 12px", cursor: uploading || !selectedFile ? "not-allowed" : "pointer" }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        <button
          onClick={handleClear}
          disabled={uploading && !selectedFile}
          style={{ padding: "8px 12px" }}
        >
          Clear
        </button>
      </div>

      {uploadSuccess && (
        <div style={{ marginTop: 12, color: "green" }}>Upload successful.</div>
      )}

      {error && (
        <div style={{ marginTop: 12, color: "crimson", whiteSpace: "pre-wrap" }}>
          {error}
        </div>
      )}
    </div>
  );
}
