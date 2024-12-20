import React, { useEffect } from "react";
import "../styles/ShoppingCart.scss";
import { useSelector, useDispatch } from "react-redux";
import CartCard from "../components/CartCard";
import { updateCartItem, updateSellCartCount, updateCartCount, updateCartMode } from "../redux/cartSlice";
import OrderSummary from "../components/OrderSummary";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cart.cartItem);
  const sellCartItem = useSelector((state) => state.cart.sellCartItem);
  const currentMode = useSelector((state) => state.cart.cartMode);
  const totalCartCount = useSelector((state) => state.cart.totalCartCount);

  const handleQuantityChange = (id, delta) => {
    const updatedCart = currentMode === "rent" ? (cartItem || []) : (sellCartItem || []);
    const updatedItem = updatedCart.find((item) => item.id === id);

    if (updatedItem) {
        const currentQuantity = currentMode === "rent" ? updatedItem.rentquantity : updatedItem.sellQuantity;
        const updatedQuantity = Math.max(1, currentQuantity + delta);

        if (currentMode === "rent") {
            dispatch(updateCartItem({ ...updatedItem, rentquantity: updatedQuantity }));
        } else {
            dispatch(updateSellCartCount({ ...updatedItem, sellQuantity: updatedQuantity }));
        }
    }
};


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
  }, [cartItem, sellCartItem, dispatch]);

  const currentCart = currentMode === "rent" ? cartItem : sellCartItem;

  return (
    <div className="shopping-cart">
      <p className={totalCartCount > 0 ? "" : "zeroItem"}>
        You have {totalCartCount} {totalCartCount > 1 ? "items" : "item"} in your cart
      </p>

      {cartItem.length > 0 || sellCartItem.length > 0 ? (
        <div className="cartsContainer">
          <div className="cart-items">
            {currentCart.map((item) => (
              <CartCard
                key={item.id}
                item={item}
                currentMode={currentMode}
                handleQuantityChange={handleQuantityChange}
              />
            ))}

            <div className="modeContainer">
              <button
                className={`btn ${currentMode === "rent" ? "active" : ""}`}
                onClick={() => dispatch(updateCartMode("rent"))}
                disabled={cartItem.length === 0 && currentMode !== "rent"}
              >
                Rent
              </button>
              <button
                className={`btn ${currentMode === "sell" ? "active" : ""}`}
                onClick={() => dispatch(updateCartMode("sell"))}
                disabled={sellCartItem.length === 0 && currentMode !== "sell"}
              >
                Sell
              </button>
            </div>
          </div>

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
