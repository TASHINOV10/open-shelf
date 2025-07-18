import React, { useState } from "react";
import "./App.css";

function ManualInput() {
  const [formData, setFormData] = useState({
    grocery_name: "",
    category: "",
    brand: "",
    price: "",
    currency: "",
    location: "",
    date: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", formData);

    try {
      const response = await fetch("http://127.0.0.1:8000/prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log("Server responded:", result);

      if (response.ok) {
        alert("Success!");
      } else {
        alert("Error: " + JSON.stringify(result));
      }
    } catch (err) {
      console.error("Failed to submit", err);
      alert("Submission failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Enter Price Manually</h2>
      <form className="manual-form" onSubmit={handleSubmit}>
        <input name="grocery_name" placeholder="Grocery Store Name" onChange={handleChange} />
        <input name="category" placeholder="Category" onChange={handleChange} />
        <input name="brand" placeholder="Brand" onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" onChange={handleChange} />
        <input name="currency" placeholder="Currency" onChange={handleChange} />
        <input name="location" placeholder="Location (City)" onChange={handleChange} />
        <input name="date" type="date" placeholder="Date" onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ManualInput;
