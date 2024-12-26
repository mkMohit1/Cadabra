// src/pages/ProductPage/components/CreateProduct.jsx
import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';

const CreateProduct = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    status: '',
    mrp: '',
    discount: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="create-product">
      <form onSubmit={handleSubmit}>
        <div className="create-product__main">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => handleChange({ target: { name: 'description', value } })}
            />
          </div>

          <div className="media-upload">
            <label>Media</label>
            <div className="upload-box">
              <p>Drop files here or click to upload.</p>
            </div>
          </div>

          <div className="form-group">
            <label>MRP</label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Discount</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="create-product__sidebar">
          <div className="form-group">
            <label>Product Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="">Select Product Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Product Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="security">Security</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Create</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
