import React, { useEffect, useState } from "react";
import "../styles/ShoppingCart.scss";
import { useSelector, useDispatch } from "react-redux";
import CartCard from "../components/CartCard";
import {
  updateCartItem,
  updateSellCartCount,
  updateCartCount,
  updateCartMode,
  validateCart,
  syncCartWithServer,
  removeOldCartItems,
} from "../redux/cartSlice";
import OrderSummary from "../components/OrderSummary";
import AddressSelector from "../components/AddressSelector";
import CartItems from "../components/CartItems";
import ShippingMethod from "../components/ShippingMethod";
import { infoToast } from "../DecryptoAndOther/ToastUpdate";
import { CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { updateCurrentContainer } from '../redux/cartSlice';
import debounce from 'lodash.debounce';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cart.cartItem);
  const cartNItem = useSelector((state) => state.cart.cartNItem);
  const user = useSelector((state) => state.auth.user);
  const currentMode = useSelector((state) => state.cart.cartMode);
  const totalCartCount = useSelector((state) => state.cart.totalCartCount);
  const totalNCartCount = useSelector((state) => state.cart.totalNCartCount);
  const currentContainer = useSelector(state=>state.cart.currentContainer);
  const currentCart = currentMode === "rent" && user ? cartItem : cartNItem;
  

  // Load cart from localStorage and remove expired items
  useEffect(() => {
    let storedCart;
    if(user){
      storedCart = localStorage.getItem("cart");
    }else{
      storedCart = localStorage.getItem("cartNuser");
    }

    if (storedCart) {
      const cartItems = JSON.parse(storedCart);
      cartItems.forEach((item) => {
        dispatch(updateCartItem(item));
      });
    }
    // dispatch(removeOldCartItems());
  }, [dispatch]);

  useEffect(() => {
   if(user){
    dispatch(syncCartWithServer({ userId: user._id, cartItems: [] }));
   }
  },[]);

  // Sync cart with the server when cart changes
  // useEffect(() => {
  //   if (user && cartItem.length > 0) {
  //     const syncCart = debounce(() => {
  //       dispatch(syncCartWithServer({ userId: user._id, cartItems: cartItem }));
  //     }, 500); // Debounce to avoid frequent requests
  //     syncCart();
  //   }
  // }, [user, cartItem, dispatch]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (cartItem && cartItem.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItem));
    } else {
      localStorage.removeItem("cart"); // Clear localStorage if cart is empty
    }
  }, [cartItem]);

  // console.log("currentCart", currentCart);
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {currentContainer === 'CartItem' && (
        <>
        <p className={`text-center mb-6 ${totalCartCount || totalNCartCount > 0 ? "" : "text-gray-500"}`}>
          You have {totalCartCount || totalNCartCount} {totalCartCount || totalNCartCount > 1 ? "items" : "item"} in your cart
        </p>
         {/* Progress Bar  */}
         {totalCartCount || totalNCartCount>0?
       <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-sm md:text-base">
      <span className={`font-medium text-blue-600`}>Carts</span>
      <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className={`text-gray-500`}>Address</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className={`text-gray-500`}>Shipping</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-500">Payment</span>
      </div>
      :""}
      </>
      )}
      {((cartItem && cartItem.length>0) || (cartNItem && cartNItem.length > 0)) ? (
        <div className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 ${currentContainer !== 'CartItem' ? 'mt-16' : ''}`}>
          <div className="lg:col-span-2">
            {currentContainer === 'AddressContainer' ? (
              <AddressSelector />
            ) : currentContainer === 'Shipping' ? (
              <ShippingMethod />
            ) : (
              <CartItems currentCart={currentCart} />
            )}
          </div>
          <div className="lg:col-span-1">
            <OrderSummary currentCart={currentCart} currentMode={currentMode} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-xl text-gray-500">Your cart is empty.</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
