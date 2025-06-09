import React from "react";
import "./App.css"; // This reuses your global styles

function ManualInput() {
  return (
    <div className="form-container">
      <h2>Enter Price Manually</h2>
      <form className="manual-form">
        <input placeholder="Grocery Store Name" />
        <input placeholder="Category" />
        <input placeholder="Brand" />
        <input type="number" placeholder="Price" />
        <input placeholder="Currency" />
        <input placeholder="Location (City)" />
        <input type="date" placeholder="Date" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ManualInput;
