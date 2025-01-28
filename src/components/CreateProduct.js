import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles (can be customized)
import { infoToast,errorToast, successToast } from "../DecryptoAndOther/ToastUpdate";
import "../styles/CreateProduct.scss";

const CreateProduct = ({ product, setShowCreateForm, fetchProducts, userID }) => {
  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    productUsp:'',
    description: '',
    category: '',
    status: '',  // Ensure this is part of the initial state
    mrp: '',
    inventory:'',
    discount: '',
    productImage: null,
  });

  // Populate form fields when editing a product
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        subTitle: product.subTitle || '',
        productUsp: product.productUsp|| '',
        description: product.description || '',
        category: product.category || '',
        status: product.status || '', // Ensure status is set
        mrp: product.mrp || '',
        inventory:product.inventory || '',
        discount: product.discount || '',
        productImage: product.productImage || null,  // Handle image separately if necessary
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.subTitle || !formData.description || !formData.category || !formData.status || !formData.mrp || !formData.discount || !formData.productImage) {
      errorToast("All fields are required, including the image.");
      return;
    }

    // Create FormData for file upload
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append('userID', userID);

    try {
      const method = product ? 'PUT' : 'POST';
      const url = product ? `${process.env.Back_Url}/admin/updateProduct/${product._id}` : `${process.env.Back_Url}/admin/addProduct`;
      const response = await fetch(url, { method, body: formDataToSend });

      if (!response.ok) {
        errorToast('Failed to save product');
        return;
      }

      const data = await response.json();
      successToast(data.message);
      setShowCreateForm(false);
      fetchProducts(); // Refresh product list
    } catch (error) {
      errorToast(`Error while saving the product: ${error}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, productImage: e.target.files[0] }));
  };

  // For displaying a preview image
  const previewImage = formData.productImage
    ? formData.productImage instanceof File
      ? URL.createObjectURL(formData.productImage)
      : `http://localhost:5000${formData.productImage}`
    : '';

  return (
    <div className="create-product">
      <form onSubmit={handleSubmit}>
        <div className="create-product__main">
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Sub - Title</label>
            <input type="text" name="subTitle" value={formData.subTitle} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Shot Features</label>
            <input type="text" name="productUsp" value={formData.productUsp} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Content</label>
            <ReactQuill
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline'],
                  ['link'],
                  [{ 'align': [] }],
                  ['image'],
                ],
              }}
              formats={['header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'align', 'image']}
            />
          </div>

          <div className="form-group">
            <label>MRP</label>
            <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Discount</label>
            <input type="number" name="discount" value={formData.discount} onChange={handleChange} />
          </div>

          {/* Image Upload Section */}
          <div className="form-group">
            <label>Product Image</label>
            <input type="file" name="productImage" accept="image/*" onChange={handleImageChange} />
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Product Preview" width="100" />
              </div>
            )}
          </div>
        </div>

        <div className="create-product__sidebar">
        <div className="form-group">
            <label>Inventory</label>
            <input type="number" name="inventory" value={formData.inventory} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Product Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="">Select Product Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label>Product Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Security">Security</option>
              <option value="CCTV">CCTV</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">{product ? 'Update' : 'Create'}</button>
          <button type="button" className="btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
