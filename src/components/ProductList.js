import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProductList = ({ products, fetchProducts, onNewProduct, onEditProduct }) => {

  const handleDeleteProduct = async (productId) => {
    const response = await fetch(`http://localhost:5000/admin/deleteProduct/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      toast.success('Product deleted successfully');
      //Optionally, you can refetch the products list after deletion
      fetchProducts();
    } else {
      toast.error('Failed to delete product');
    }
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
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td className="product-cell">
                <img src={`http://localhost:5000${product.productImage}`} alt={product.title} />
                <span>{product.title}</span>
              </td>
              <td>{product.mrp}₹</td>
              <td>{product.discount}%</td>
              <td>{(product.mrp - (product.mrp * (product.discount / 100))).toFixed(2)} ₹</td>
              <td>
                <span className="status-badge">{product.status}</span>
              </td>
              <td className="action-cell">
                <button className="btn-icon edit" onClick={() => onEditProduct(product)}>✏️</button>
                <button className="btn-icon delete" onClick={() => handleDeleteProduct(product._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
