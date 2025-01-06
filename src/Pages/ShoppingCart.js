import React, { useEffect, useState } from "react";
import "../styles/ShoppingCart.scss";
import { useSelector, useDispatch } from "react-redux";
import CartCard from "../components/CartCard";
import { updateCartItem, updateSellCartCount, updateCartCount, updateCartMode } from "../redux/cartSlice";
import OrderSummary from "../components/OrderSummary";
import AddressSelector from "../components/AddressSelector";
import CartItems from "../components/CartItems";
import ShippingMethod from "../components/ShippingMethod";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cart.cartItem);
  const sellCartItem = useSelector((state) => state.cart.sellCartItem);
  const currentMode = useSelector((state) => state.cart.cartMode);
  const totalCartCount = useSelector((state) => state.cart.totalCartCount);
  const currentContainer = useSelector((state) => state.cart.currentContainer);
 


  useEffect(() => {
    if (cartItem.length === 0 && sellCartItem.length > 0) {
      dispatch(updateCartMode("sell"));
      dispatch(updateCartCount(sellCartItem.length));
    } else if (sellCartItem.length === 0 && cartItem.length > 0) {
      dispatch(updateCartMode("rent"));
      dispatch(updateCartCount(cartItem.length));
    } else {
      dispatch(updateCartCount(cartItem.length));
    }
  }, [cartItem, sellCartItem, dispatch, currentContainer]);

  const currentCart = currentMode === "rent" ? cartItem : sellCartItem;

  return (
    <div className="shopping-cart">
      {currentContainer =='CartItem'?
      <p className={totalCartCount > 0 ? "" : "zeroItem"}>
        You have {totalCartCount} {totalCartCount > 1 ? "items" : "item"} in your cart
      </p>
      :null}
      {cartItem.length > 0 || sellCartItem.length > 0 ? (
        <div className="cartsContainer" style={currentContainer != 'CartItem' ? { marginTop: '4rem' } : null}>
          {currentContainer == 'AddressContainer' ? (
              <AddressSelector />
            ):currentContainer=='Shipping'? <ShippingMethod/>
            :<CartItems currentCart={currentCart}/>
          }
          <OrderSummary currentCart={currentCart} currentMode={currentMode} />
        </div>
      ) : (
        <div className="emptyCart">
          <p>Your cart is empty.</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
