import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

export default function Home() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/v1/products")
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load items");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #eee", marginBottom: "2rem" }}>
        <Link to="/login">Login</Link>
      </nav>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2>Products</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
