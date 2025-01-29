import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import CreateProduct from '../components/CreateProduct';
import '../styles/ProductPage.scss';
import { useSelector } from 'react-redux';

const ProductPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const currentUser = useSelector((state) => state.auth.user);
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);

  // Fetch products when user ID is available
  const fetchProducts = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACK_URL}/admin/getProducts/${currentUser._id}`);
    const data = await response.json();
    setProducts(data.products);
  };

  useEffect(() => {
    if (currentUser?._id) {
      fetchProducts();
    }
  }, [currentUser?._id]);

  const handleProductEdit=(product)=>{
    setProductToEdit(product);
    console.log("mksdfs",product);
    setShowCreateForm(true);
  }

  return (
    <div className="product-page">
      {!showCreateForm ? (
        <ProductList 
          products={products} 
          onNewProduct={() => { setProductToEdit(null); setShowCreateForm(true); }} 
          onEditProduct={handleProductEdit} 
          fetchProducts={fetchProducts}
        />
      ) : (
        <CreateProduct 
          onCancel={() => setShowCreateForm(false)} 
          product={productToEdit} 
          setShowCreateForm={setShowCreateForm} 
          fetchProducts={fetchProducts} 
          userID={currentUser._id} 
        />
      )}
    </div>
  );
};

export default ProductPage;
