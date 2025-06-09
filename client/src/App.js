import React, { useState } from 'react';

function App() {
  const [form, setForm] = useState({
    product: '',
    store: '',
    price: '',
    date: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/prices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product: form.product,
        store: form.store,
        price: parseFloat(form.price),
        date: form.date
      })
    });

    const data = await response.json();
    console.log("Submitted:", data);
    alert("Submitted successfully!");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Submit a Price</h2>
      <form onSubmit={handleSubmit}>
        <input name="product" placeholder="Product" onChange={handleChange} /><br /><br />
        <input name="store" placeholder="Store" onChange={handleChange} /><br /><br />
        <input name="price" type="number" step="0.01" placeholder="Price" onChange={handleChange} /><br /><br />
        <input name="date" type="date" onChange={handleChange} /><br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
