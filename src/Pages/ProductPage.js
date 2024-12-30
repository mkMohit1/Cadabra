// src/pages/ProductPage/ProductPage.jsx
import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import CreateProduct from '../components/CreateProduct';
import '../styles/ProductPage.scss';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null); // For handling the edit mode 
  
  const handleNewProduct = () => {
    setProductToEdit(null); // Reset product to edit
    setShowCreateForm(true);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product); // Set the product to be edited
    setShowCreateForm(true);
  };

  const handleCreateOrUpdateProduct = async (productData) => {
    let response;
    if (productToEdit) {
      // Update existing product
      response = await fetch(`http://localhost:5000/admin/updateProduct/${productToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...productData, userID: currentUser.userID })
      });
      toast.success('Product updated successfully');
    } else {
      // Create new product
      response = await fetch('http://localhost:5000/admin/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...productData, userID: currentUser.userID })
      });
      toast.success('Product added successfully');
    }

    if (response.ok) {
      setShowCreateForm(false);
      fetchProducts(); // Refresh products list
    } else {
      toast.error('Failed to save product');
    }
  };

  const fetchProducts = async () => {
    const response = await fetch(`http://localhost:5000/admin/getProducts/${currentUser.userID}`);
    const data = await response.json();
    setProducts(data.products);
  };

  useEffect(() => {
    if (currentUser?.userID) {
      fetchProducts();
    }
  }, [currentUser?.userID]);


  return (
    <div className="product-page">
      {!showCreateForm ? (
        <ProductList products={products} onNewProduct={handleNewProduct}  onEditProduct={handleEditProduct}/>
      ) : (
        <CreateProduct onSubmit={handleCreateOrUpdateProduct} onCancel={() => setShowCreateForm(false)}  product={productToEdit} />
      )}
    </div>
  );
};

export default ProductPage;