import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import { toast } from 'react-toastify';  // Ensure to import toast for error messages

const CreateProduct = ({ onSubmit, onCancel, product }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
    status: '',
    mrp: '',
    discount: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        slug: product.slug,
        description: product.description,
        category: product.category,
        status: product.status,
        mrp: product.mrp,
        discount: product.discount
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation check: Ensure all fields except the image are filled
    if (
      !formData.title ||
      !formData.slug ||
      !formData.description ||
      !formData.category ||
      !formData.status ||
      !formData.mrp ||
      !formData.discount
    ) {
      toast.error("All fields are required.");
      return;  // Prevent form submission if validation fails
    }

    // If all validations are passed, submit the form
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
              <option value="CCTV">CCTV</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {product ? 'Update' : 'Create'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
