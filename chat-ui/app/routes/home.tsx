import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router";
import ProductItem from "~/components/productItem";
import api from "~/services/axiosInterceptor";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookie, removeCookie] = useCookies(['jwtToken'])
  let navigate = useNavigate();
  console.log(cookies)
  useEffect(() => {
    api.get("/api/v1/products")
      .then(res => {
        setItems(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load items");
        setLoading(false);
      });
  }, []);

  const logout = () => {
    removeCookie('jwtToken')
    navigate('/')
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)" }}>
      <nav
        style={{
          width: "100%",
          background: "linear-gradient(90deg, #fffde7 0%, #fff9c4 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          marginBottom: "2rem"
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "1.3rem", color: "#ce9504ff", padding: "1.5rem" }}>Beach Fashion</span>
        {cookies.jwtToken ?
          <button
            onClick={logout}
            style={{
              color: "#000",
              background: "#FF8E29",
              padding: "0.5rem 1.2rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "1rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              marginRight: "1rem"
            }}>Logout</button> :
            <Link
            to="/login"
            style={{
              color: "#000",
              background: "#fbc02d",
              padding: "0.5rem 1.2rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "1rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              marginRight: "1rem"
            }}
          >
            Login
          </Link>
        }
      </nav>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem" }}>
        <h2 style={{ color: "#616161", marginBottom: "1.5rem", textAlign: "center" }}>Products</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center" }}>
          {items.map((item, idx) => (
            <ProductItem
              key={idx}
              name={item.name}
              imageUrl={item.imageUrl}
              price={item.price}
              quantityDiscount={item.quantityDiscount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
