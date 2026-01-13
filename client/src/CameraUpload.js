// src/CameraUpload.js
import React, { useState } from "react";
import { API_BASE } from "./apiConfig";

function CameraUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [parsedReceipt, setParsedReceipt] = useState(null);
  const [editedReceipt, setEditedReceipt] = useState(null);

  const [receiptId, setReceiptId] = useState(null);     
  const [saving, setSaving] = useState(false);          

  // Per-field edit state for meta data
  const [editingMeta, setEditingMeta] = useState({
    storeName: false,
    storeLocation: false,
    postDate: false,
  });

  // Which item row is currently in edit mode (null => none)
  const [editingItemIndex, setEditingItemIndex] = useState(null);

  const [confirmMessage, setConfirmMessage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadSuccess(false);
    setError(null);

    setParsedReceipt(null);
    setEditedReceipt(null);
    setEditingMeta({
      storeName: false,
      storeLocation: false,
      postDate: false,
    });
    setEditingItemIndex(null);
    setConfirmMessage(null);
    setReceiptId(null); 
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Моля, първо изберете снимка на касова бележка.");
      return;
    }

    setUploading(true);
    setUploadSuccess(false);
    setError(null);
    setConfirmMessage(null);

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

      const data = await response.json();
      const parsed = data.parsed_receipt || null;

      setParsedReceipt(parsed);
      const cloned = parsed ? JSON.parse(JSON.stringify(parsed)) : null;
      setEditedReceipt(cloned);

      setUploadSuccess(true);

      setReceiptId(data.receipt_id || null);

    } catch (err) {
      console.error(err);
      setError(err.message || "Възникна неочаквана грешка при качването.");
    } finally {
      setUploading(false);
    }
  };

  const hasItems =
    editedReceipt &&
    Array.isArray(editedReceipt.items) &&
    editedReceipt.items.length > 0;

  // ====== Edit handlers ======

  const handleMetaChange = (section, field, value) => {
    setEditedReceipt((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };

      if (section === "store") {
        updated.store = { ...(prev.store || {}) };
        updated.store[field] = value;
      } else if (section === "receipt") {
        updated.receipt = { ...(prev.receipt || {}) };
        updated.receipt[field] = value;
      }

      return updated;
    });
  };

  const toggleMetaEdit = (fieldKey) => {
    setEditingMeta((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const handleItemChange = (index, field, value) => {
    setEditedReceipt((prev) => {
      if (!prev || !Array.isArray(prev.items)) return prev;
      const updatedItems = prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prev, items: updatedItems };
    });
  };

  const toggleItemEdit = (index) => {
    setEditingItemIndex((prevIndex) =>
      prevIndex === index ? null : index
    );
  };

  const handleConfirm = async () => {
    if (!editedReceipt || !receiptId) {
      setConfirmMessage(
        "Липсва информация за бележката или ID. Моля, качете отново снимката."
      );
      return;
    }

    setSaving(true);
    setConfirmMessage(null);

    try {
      const response = await fetch(`${API_BASE}/confirm-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receipt_id: receiptId,
          store: editedReceipt.store,
          receipt: editedReceipt.receipt,
          items: editedReceipt.items,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Грешка при записване на бележката: ${response.status} ${text}`
        );
      }

      const data = await response.json();
      console.log("Saved to DB:", data);

      setConfirmMessage("Качването е потвърдено и записано в базата данни.");
    } catch (err) {
      console.error(err);
      setConfirmMessage(
        "Възникна грешка при записването в базата. Моля, опитайте отново."
      );
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="camera-page">
      {/* LEFT SIDE – upload + preview */}
      <div className="camera-upload-container">
        <h1 className="page-title">Качи касова бележка</h1>

        <div className="privacy-banner">
          Снимката се използва за извличане на цените на продуктите. Не се съхраняват лични данни и не се споделят изображенията с трети страни.
        </div>

        <div className="file-select-row">
          <label className={`file-select-label${uploading ? " disabled" : ""}`}>
            <div className="file-select-copy">
              <span className="file-select-title">Избери файл</span>
            </div>
            <input
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

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
          className="upload-button primary-button"
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
        >
          {uploading ? "Качване..." : "Качи бележката"}
        </button>

        {uploading && (
          <div className="loader-wrapper">
            <div className="loader-circle" />
            <span>Обработваме бележката...</span>
          </div>
        )}

        {uploadSuccess && !uploading && (
          <div className="success-banner">Моля, потвърдете прочетените данни!</div>
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

      {/* RIGHT SIDE – parsed & editable result */}
      <div className="receipt-result-panel">
        <h2>Резултат от разчитането</h2>

        {!editedReceipt && !uploading && (
          <p className="placeholder-text">
            Качи касова бележка, за да видиш извлечените данни тук.
          </p>
        )}

        {uploading && (
          <p className="placeholder-text">
            Моля, изчакай – извличаме информацията от бележката...
          </p>
        )}

        {editedReceipt && (
          <>
            {/* META DATA */}
            <div className="receipt-meta">
              <div className="meta-row">
                <strong>Име на магазин:</strong>
                {editingMeta.storeName ? (
                  <input
                    className="meta-input"
                    type="text"
                    value={editedReceipt.store?.name ?? ""}
                    onChange={(e) =>
                      handleMetaChange("store", "name", e.target.value)
                    }
                  />
                ) : (
                  <span>{editedReceipt.store?.name ?? "—"}</span>
                )}
                <button
                  type="button"
                  className={`icon-button ${
                    editingMeta.storeName ? "icon-button-active" : ""
                  }`}
                  onClick={() => toggleMetaEdit("storeName")}
                  aria-label="Редактирай име на магазина"
                >
                  <span className="pen-icon">✏️</span>
                </button>
              </div>

              <div className="meta-row">
                <strong>Локация:</strong>
                {editingMeta.storeLocation ? (
                  <input
                    className="meta-input"
                    type="text"
                    value={editedReceipt.store?.location ?? ""}
                    onChange={(e) =>
                      handleMetaChange("store", "location", e.target.value)
                    }
                  />
                ) : (
                  <span>{editedReceipt.store?.location ?? "—"}</span>
                )}
                <button
                  type="button"
                  className={`icon-button ${
                    editingMeta.storeLocation ? "icon-button-active" : ""
                  }`}
                  onClick={() => toggleMetaEdit("storeLocation")}
                  aria-label="Редактирай локация"
                >
                  <span className="pen-icon">✏️</span>
                </button>
              </div>

              <div className="meta-row">
                <strong>Дата на покупка:</strong>
                {editingMeta.postDate ? (
                  <input
                    className="meta-input"
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={editedReceipt.receipt?.post_date ?? ""}
                    onChange={(e) =>
                      handleMetaChange("receipt", "post_date", e.target.value)
                    }
                  />
                ) : (
                  <span>{editedReceipt.receipt?.post_date ?? "—"}</span>
                )}
                <button
                  type="button"
                  className={`icon-button ${
                    editingMeta.postDate ? "icon-button-active" : ""
                  }`}
                  onClick={() => toggleMetaEdit("postDate")}
                  aria-label="Редактирай дата"
                >
                  <span className="pen-icon">✏️</span>
                </button>
              </div>
            </div>

            {/* ITEMS */}
            <div className="items-section">
              <h3>Артикули</h3>
              {hasItems ? (
                <ul className="items-list">
                  {editedReceipt.items.map((item, index) => {
                    const isEditing = editingItemIndex === index;
                    return (
                      <li key={index} className="item-row">
                        {isEditing ? (
                          <>
                            <input
                              className="item-input item-name-input"
                              type="text"
                              value={item.name ?? ""}
                              onChange={(e) =>
                                handleItemChange(index, "name", e.target.value)
                              }
                            />
                            <input
                              className="item-input item-price-input"
                              type="number"
                              step="0.01"
                              value={
                                item.price === null ||
                                item.price === undefined
                                  ? ""
                                  : item.price
                              }
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "price",
                                  e.target.value === ""
                                    ? null
                                    : Number(e.target.value)
                                )
                              }
                            />
                          </>
                        ) : (
                          <>
                            <span className="item-name">{item.name}</span>
                            <span className="item-price">
                              {item.price != null
                                ? item.price.toFixed(2)
                                : "—"}
                            </span>
                          </>
                        )}
                        <button
                          type="button"
                          className={`icon-button ${
                            isEditing ? "icon-button-active" : ""
                          }`}
                          onClick={() => toggleItemEdit(index)}
                          aria-label="Редактирай артикул"
                        >
                          <span className="pen-icon">✏️</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>Няма разчетени артикули.</p>
              )}
            </div>

            {/* CONFIRM BUTTON */}
            <div className="confirm-area">
              <button
                className="confirm-button primary-button"
                onClick={handleConfirm}
                disabled={!editedReceipt || !receiptId || saving}

              >
                {saving ? "Записваме..." : "Потвърди качването"}
              </button>

              {confirmMessage && (
                <p className="confirm-message">{confirmMessage}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CameraUpload;
