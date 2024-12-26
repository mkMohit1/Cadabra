// src/pages/ProductPage/components/ProductList.jsx
import React from 'react';

const ProductList = ({ products, onNewProduct }) => {
  console.log(products);
  const handleDeleteProduct = async() => {
    const response = await fetch('http://localhost:5000/admin/deleteProduct', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({products})
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="product-list">
      <div className="product-list__header">
        <h1>Products</h1>
        <button className="btn-primary" onClick={onNewProduct}>
          New Product
        </button>
      </div>
      <div className="product-list__filters">
        <button className="btn-reset">Reset</button>
        <input type="search" placeholder="Search" className="search-input" />
      </div>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>MRP</th>
            <th>Discount %</th>
            <th>End User Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td className="product-cell">
                <img src={product.image} alt={product.title} />
                <span>{product.title}</span>
              </td>
              <td>{product.mrp}₹</td>
              <td>{product.discount}%</td>
              <td>{product.endUserPrice}₹</td>
              <td>
                <span className="status-badge">{product.status}</span>
              </td>
              <td className="action-cell">
                <button className="btn-icon edit">✏️</button>
                <button className="btn-icon delete" onClick={handleDeleteProduct}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
