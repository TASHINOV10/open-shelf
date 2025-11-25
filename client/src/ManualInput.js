// src/ManualInput.js
import React, { useState } from "react";
import { API_BASE } from "./apiConfig";

function ManualInput() {
  const [formData, setFormData] = useState({
    store_name: "",
    product_name: "",
    unit_price: "",
  });

  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setStatus(null);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE}/prices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
          `Грешка при записване на цената: ${response.status} ${detail}`
        );
      }

      // const data = await response.json(); // use if needed

      setStatus("success");
      setFormData({
        store_name: "",
        product_name: "",
        unit_price: "",
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Възникна неочаквана грешка.");
    }
  };

  return (
    <div className="form-container">
      <form className="manual-form" onSubmit={handleSubmit}>
        <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>Ръчно въвеждане</h2>

        <input
          type="text"
          name="store_name"
          placeholder="Име на магазин"
          value={formData.store_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="product_name"
          placeholder="Продукт"
          value={formData.product_name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="unit_price"
          placeholder="Единична цена"
          value={formData.unit_price}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
        />

        <button type="submit">Запиши цена</button>

        {status === "success" && (
          <p style={{ marginTop: "1rem", color: "#a3ffb0" }}>
            Цената е записана успешно!
          </p>
        )}
        {status === "error" && (
          <p style={{ marginTop: "1rem", color: "#ffb3b3" }}>
            {errorMessage || "Възникна грешка при записването."}
          </p>
        )}
      </form>
    </div>
  );
}

export default ManualInput;
