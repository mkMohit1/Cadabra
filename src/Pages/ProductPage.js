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

  const handleNewProduct = () => {
    setShowCreateForm(true);
  };

  const handleCreateProduct = async(newProduct) => {
    console.log(newProduct);
    const response = await fetch('http://localhost:5000/admin/addProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...newProduct, userID: currentUser.userID})
    });
    toast.success('Product added successfully');
    setShowCreateForm(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/admin/getProducts/${currentUser.userID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    if (currentUser?.userID) {
        fetchProducts();
    }
}, [currentUser?.userID]); // Runs when currentUser.userID changes


  return (
    <div className="product-page">
      {!showCreateForm ? (
        <ProductList products={products} onNewProduct={handleNewProduct} />
      ) : (
        <CreateProduct onSubmit={handleCreateProduct} onCancel={() => setShowCreateForm(false)} />
      )}
    </div>
  );
};

export default ProductPage;