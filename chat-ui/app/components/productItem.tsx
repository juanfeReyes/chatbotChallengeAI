import React from "react";

interface ProductItemProps {
  name: string;
  price: number;
  quantityDiscount: string;
  imageUrl: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ name, price, quantityDiscount, imageUrl }) => {
  return (
    <div style={{
      background: "#f0f8ff",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      padding: "16px",
      maxWidth: "240px",
      minWidth: "200px",
      textAlign: "center",
    }}>
      <img
        src={imageUrl}
        alt={name}
        style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px" }}
      />
      <h3 style={{ margin: "12px 0 8px", fontSize: "1.1rem", color: "#1a237e" }}>{name}</h3>
      <div style={{ fontWeight: "bold", color: "#1976d2", marginBottom: "6px" }}>${price.toFixed(2)}</div>
      <div style={{ color: "#ffb300", fontSize: "0.95rem" }}>{quantityDiscount}</div>
    </div>
  );
};

export default ProductItem;
